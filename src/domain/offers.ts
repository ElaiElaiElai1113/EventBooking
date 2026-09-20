import type { DemoState } from "./model";
import type { Command } from "./commands";
import { actor, requireRule, agreement, payer, receiver } from "./validation";
import { afterHours, stamp } from "./time";
import { isEligibleChoice } from "./inventory";
import { paid } from "./selectors";
export function offerCommand(s: DemoState, c: Command): boolean {
  if (c.type === "sendOffer") {
    actor(c, "organizer", "sample-market-team");
    requireRule(
      s.event.status === "published" &&
        s.event.arrangement.agreedVersion === s.event.arrangement.version,
      "PUBLICATION",
      "Publish the current agreed event before sending offers.",
    );
    requireRule(
      stamp(s.now) >= stamp(s.event.closes),
      "EARLY",
      "Initial offers begin after applications close.",
    );
    const a = s.applications.find((a) => a.id === c.id);
    requireRule(
      a &&
        a.snapshots.length &&
        !["draft", "declined", "withdrawn"].includes(a.status),
      "APPLICATION",
      "Choose an eligible submitted application.",
    );
    const old = s.agreements.find(
      (g) => g.parentId === a.id && g.allocation !== "released",
    );
    requireRule(
      !old || c.replace,
      "ACTIVE_OFFER",
      "This application already has an active offer.",
    );
    if (old) {
      requireRule(
        !old.acceptedAt && !s.receipts.some((r) => r.agreementId === old.id),
        "REVIEW",
        "Accepted or paid offers need staff change review.",
      );
      old.allocation = "released";
      old.status = "replaced";
    }
    requireRule(
      isEligibleChoice(c.booths, s.event.pairs),
      "PAIR",
      "Use one booth or a physically eligible adjacent pair. 26 + 27 crosses the walkway.",
    );
    const booths = c.booths.map((id) =>
      s.event.booths.find((b) => b.id === id),
    );
    requireRule(
      booths.every((b) => b && !b.unavailable),
      "BOOTH",
      "Unknown or unavailable booth.",
    );
    requireRule(
      !s.agreements.some(
        (g) =>
          g.kind === "merchant" &&
          g.allocation !== "released" &&
          g.boothIds.some((id) => c.booths.includes(id)),
      ),
      "CONFLICT",
      "One or more booths are already held or confirmed. No part of this choice was held.",
    );
    const d = a.snapshots.at(-1)!.data;
    requireRule(
      !d.power || booths.some((b) => b?.power && b.watts >= d.watts),
      "POWER",
      "This allocation does not meet the submitted power requirement.",
    );
    const expiry = afterHours(s.now, 48),
      t = s.event.terms;
    requireRule(
      stamp(expiry) < stamp(s.event.setup) &&
        (t.mode === "full" || stamp(expiry) <= stamp(t.balanceDue)),
      "SCHEDULE",
      "The full 48-hour window must fit before balance and setup deadlines.",
    );
    const total = booths.reduce((n, b) => n + b!.price, 0);
    requireRule(
      total > 0 &&
        Number.isSafeInteger(total) &&
        (t.mode === "full" || (t.percent > 0 && t.percent < 100)),
      "AMOUNT",
      "Check booth prices and deposit terms.",
    );
    const version = s.agreements.filter((g) => g.parentId === a.id).length + 1;
    s.agreements.push({
      contextSnapshot: {
        eventName: s.event.name,
        start: s.event.start,
        end: s.event.end,
        setup: s.event.setup,
        cleanup: s.event.cleanup,
        arrangementVersion: s.event.arrangement.version,
        rules: s.event.arrangement.rules,
        booths: structuredClone(booths.filter((b) => !!b)),
      },
      id: `offer-${a.id}-${version}`,
      kind: "merchant",
      parentId: a.id,
      version,
      payerId: a.businessId,
      payerName: d.name,
      recipient: s.event.organizer,
      recipientRole: "organizer",
      boothIds: [...c.booths],
      lineItems: booths.map((b) => ({
        label: `Booth ${b!.id}`,
        amount: b!.price,
      })),
      total,
      initial:
        t.mode === "full" ? total : Math.round((total * t.percent) / 100),
      terms: structuredClone(t),
      issuedAt: s.now,
      expiresAt: expiry,
      status: "active",
      allocation: "held",
      extensions: [],
      history: [
        `${s.now}: Exact offer sent; ${c.booths.join(" + ")} held together.`,
      ],
    });
    a.history.push(
      `${s.now}: Offer version ${version} sent for ${c.booths.join(" + ")}.`,
    );
    return true;
  }
  if (c.type === "accept" || c.type === "decline" || c.type === "extend") {
    const a = agreement(s, c.id);
    if (c.type === "accept") {
      payer(c, a);
      requireRule(
        a.status === "active" &&
          a.allocation === "held" &&
          stamp(s.now) < stamp(a.expiresAt),
        "EXPIRED",
        "Only an active, unexpired offer can be accepted.",
      );
      a.acceptedAt = s.now;
      a.status = "accepted";
      a.history.push(
        `${s.now}: Exact version ${a.version} accepted; original deadline retained.`,
      );
    }
    if (c.type === "decline") {
      payer(c, a);
      requireRule(
        ["active", "accepted"].includes(a.status) &&
          !s.receipts.some(
            (r) => r.agreementId === a.id && r.status !== "rejected",
          ) &&
          !paid(s, a.id),
        "REVIEW",
        "Recorded proof/payment requires staff cancellation review.",
      );
      a.status = "declined";
      a.allocation = "released";
      a.history.push(`${s.now}: Unpaid offer declined; application retained.`);
    }
    if (c.type === "extend") {
      receiver(c, a);
      requireRule(
        a.allocation === "held" &&
          stamp(c.until) > stamp(a.expiresAt) &&
          c.reason.trim(),
        "EXTENSION",
        "Extend an active hold with a later deadline and a reason.",
      );
      const cutoff = a.kind === "merchant" ? s.event.setup : a.accessStart!;
      requireRule(
        stamp(c.until) < stamp(cutoff) &&
          (a.terms.mode === "full" ||
            stamp(c.until) <= stamp(a.terms.balanceDue)),
        "SCHEDULE",
        "Extension must fit before balance and readiness deadlines.",
      );
      a.extensions.push({ at: s.now, until: c.until, reason: c.reason });
      a.expiresAt = c.until;
      a.history.push(`${s.now}: Explicit extension to ${c.until}: ${c.reason}`);
    }
    return true;
  }
  return false;
}
