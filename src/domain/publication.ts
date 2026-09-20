import type { DemoState, Issue } from "./model";
import type { Command } from "./commands";
import { actor, requireRule } from "./validation";
import { stamp, afterHours } from "./time";
import { physicalPairs } from "@/demo/fixtures";
import { isEligibleChoice } from "./inventory";
import { paid } from "./selectors";
export function publicationIssues(s: DemoState): Issue[] {
  const e = s.event,
    a = e.arrangement,
    t = e.terms,
    issues: Issue[] = [];
  const add = (condition: unknown, message: string, field: string) => {
    if (!condition) issues.push({ code: "PUBLICATION", message, field });
  };
  add(
    e.name.trim() &&
      e.organizer.trim() &&
      e.contact.includes("@") &&
      e.description.trim() &&
      e.categories.trim() &&
      e.selection.trim(),
    "Complete event identity, contact, description and application requirements.",
    "details",
  );
  add(
    a.venueName.trim() &&
      a.address.trim() &&
      a.contact.trim() &&
      a.rules.trim(),
    "Complete venue access, contact and operating rules.",
    "venue",
  );
  const dates = [
    a.accessStart,
    e.setup,
    e.start,
    e.end,
    e.cleanup,
    a.accessEnd,
  ].map(stamp);
  add(
    dates.every(Number.isFinite) &&
      dates[0] <= dates[1] &&
      dates[1] <= dates[2] &&
      dates[2] < dates[3] &&
      dates[3] <= dates[4] &&
      dates[4] <= dates[5],
    "Event, setup and cleanup must fit inside venue access.",
    "details",
  );
  add(
    stamp(e.opens) < stamp(e.closes) && stamp(e.closes) < stamp(e.decisions),
    "Application opening, closing and decisions must be in order.",
    "applications",
  );
  add(
    Number.isFinite(stamp(e.decisions)) &&
      stamp(afterHours(e.decisions, 48)) < stamp(e.setup) &&
      (t.mode === "full" ||
        (stamp(afterHours(e.decisions, 48)) <= stamp(t.balanceDue) &&
          stamp(t.balanceDue) < stamp(e.setup))),
    "Allow the full 48-hour window before balance and setup deadlines.",
    "payments",
  );
  add(
    t.mode === "full" || (t.percent > 0 && t.percent < 100),
    "Deposit percentage must be greater than 0 and below 100.",
    "payments",
  );
  add(
    t.instructions.trim() &&
      t.withdrawal.trim() &&
      t.organizerCancellation.trim() &&
      t.missedBalance.trim(),
    "Complete payment instructions and all policy sections.",
    "payments",
  );
  add(
    e.booths.length > 0 &&
      new Set(e.booths.map((b) => b.id)).size === e.booths.length &&
      e.booths.some((b) => !b.unavailable) &&
      e.booths.every(
        (b) =>
          Number.isSafeInteger(b.price) &&
          b.price > 0 &&
          b.width > 0 &&
          b.depth > 0 &&
          b.inclusions.trim(),
      ),
    "Booths need unique IDs, valid dimensions/prices and at least one available space.",
    "venue",
  );
  add(
    e.pairs.every(
      (p) =>
        p.length === 2 &&
        isEligibleChoice(p, physicalPairs) &&
        p.every((id) => e.booths.some((b) => b.id === id)),
    ) &&
      new Set(e.pairs.map((p) => [...p].sort().join("-"))).size ===
        e.pairs.length,
    "Pair links must match the physical layout and cannot repeat.",
    "venue",
  );
  add(
    a.agreedVersion === a.version,
    "The venue must agree to the current arrangement version.",
    "venue",
  );
  add(
    a.packet.every(
      (p) =>
        !p.required ||
        !p.applicable ||
        (p.supplied && p.reviewedVersion === p.version && !p.change),
    ),
    "Required current packet items must be supplied and reviewed.",
    "venue",
  );
  add(
    a.prerequisite === "none" ||
      s.agreements.some(
        (g) =>
          g.parentId === "organizer-rental" &&
          g.kind === "venue" &&
          g.status === "confirmed" &&
          g.allocation === "confirmed" &&
          g.recipient === a.venueName &&
          stamp(g.accessStart!) <= stamp(a.accessStart) &&
          stamp(g.accessEnd!) >= stamp(a.accessEnd) &&
          paid(s, g.id) >= g.initial,
      ),
    "The recorded rental-deposit prerequisite is still outstanding.",
    "venue",
  );
  return issues;
}
export function reviseArrangement(s: DemoState, reason: string) {
  const a = s.event.arrangement;
  s.event.status = "draft";
  a.version++;
  a.packet.forEach((p) => {
    p.version = a.version;
    p.reviewedVersion = null;
  });
  a.history.push(`${s.now}: ${reason}; review version ${a.version}.`);
}
export function eventCommand(s: DemoState, c: Command): boolean {
  const e = s.event,
    a = e.arrangement;
  switch (c.type) {
    case "saveEvent":
      actor(c, "organizer", "sample-market-team");
      requireRule(
        c.patch.name === undefined || c.patch.name.trim(),
        "NAME",
        "An event name is required.",
      );
      if (
        ["start", "end", "setup", "cleanup"].some(
          (k) =>
            k in c.patch &&
            c.patch[k as keyof typeof c.patch] !== e[k as keyof typeof c.patch],
        )
      )
        reviseArrangement(s, "Schedule revised");
      Object.assign(e, c.patch);
      return true;
    case "saveTerms":
      actor(c, "organizer", "sample-market-team");
      e.terms = { ...structuredClone(c.terms), version: e.terms.version + 1 };
      e.history.push(
        `${s.now}: Merchant terms revised; existing offers unchanged.`,
      );
      return true;
    case "saveArrangement":
      actor(c, "organizer", "sample-market-team");
      if (
        [
          "rules",
          "accessStart",
          "accessEnd",
          "existing",
          "venueName",
          "address",
          "contact",
          "prerequisite",
        ].some((k) => a[k as keyof typeof a] !== c[k as keyof typeof c])
      )
        reviseArrangement(s, "Venue arrangement revised");
      Object.assign(a, {
        rules: c.rules,
        accessStart: c.accessStart,
        accessEnd: c.accessEnd,
        existing: c.existing,
        venueName: c.venueName,
        address: c.address,
        contact: c.contact,
        prerequisite: c.prerequisite,
      });
      return true;
    case "editBooth": {
      actor(c, "organizer", "sample-market-team");
      const i = e.booths.findIndex((b) => b.id === c.booth.id);
      requireRule(i >= 0, "BOOTH", "Unknown booth.");
      const old = e.booths[i];
      if (
        [
          "row",
          "width",
          "depth",
          "power",
          "watts",
          "restrictions",
          "unavailable",
        ].some(
          (k) => old[k as keyof typeof old] !== c.booth[k as keyof typeof old],
        )
      )
        reviseArrangement(s, "Booth arrangement revised");
      e.booths[i] = structuredClone(c.booth);
      return true;
    }
    case "editPairs":
      actor(c, "organizer", "sample-market-team");
      requireRule(
        c.pairs.every(
          (p) => p.length === 2 && isEligibleChoice(p, physicalPairs),
        ),
        "PAIR",
        "26 + 27 crosses the walkway. Use physically eligible pairs.",
      );
      e.pairs = structuredClone(c.pairs);
      reviseArrangement(s, "Eligible pairs revised");
      return true;
    case "supplyPacket": {
      const p = a.packet.find((p) => p.id === c.id);
      requireRule(p, "PACKET", "Unknown packet item.");
      actor(
        c,
        p.owner,
        p.owner === "venue" ? "sample-hall" : "sample-market-team",
      );
      requireRule(c.preview.trim(), "PACKET", "Supply sample information.");
      reviseArrangement(s, "Packet updated");
      p.preview = c.preview;
      p.supplied = true;
      p.change = "";
      return true;
    }
    case "reviewPacket": {
      actor(c, "venue", "sample-hall");
      const p = a.packet.find((p) => p.id === c.id);
      requireRule(p, "PACKET", "Unknown packet item.");
      if (c.decision === "not-applicable") {
        requireRule(
          c.text.trim(),
          "REASON",
          "Explain why this item is not applicable.",
        );
        p.applicable = false;
        p.change = "";
      } else if (c.decision === "change") {
        requireRule(c.text.trim(), "REASON", "Describe the required change.");
        p.change = c.text;
        p.reviewedVersion = null;
        a.agreedVersion = null;
      } else {
        requireRule(
          p.supplied && !p.change,
          "PACKET",
          "Resolve required changes and supply this item first.",
        );
        p.reviewedVersion = p.version;
      }
      a.history.push(`${s.now}: ${p.title}: ${c.decision} ${c.text}`);
      return true;
    }
    case "reviewAllPacket":
      actor(c, "venue", "sample-hall");
      requireRule(
        a.packet.every(
          (p) => !p.required || !p.applicable || (p.supplied && !p.change),
        ),
        "PACKET",
        "Supply missing items and resolve changes first.",
      );
      a.packet
        .filter((p) => p.applicable && p.supplied)
        .forEach((p) => (p.reviewedVersion = p.version));
      return true;
    case "agree":
      actor(c, "venue", "sample-hall");
      requireRule(
        a.packet.every(
          (p) =>
            !p.required ||
            !p.applicable ||
            (p.supplied && p.reviewedVersion === p.version && !p.change),
        ),
        "PACKET",
        "Review the current required packet first.",
      );
      a.agreedVersion = a.version;
      a.agreedAt = s.now;
      a.snapshots.push({
        version: a.version,
        rules: a.rules,
        accessStart: a.accessStart,
        accessEnd: a.accessEnd,
        booths: structuredClone(e.booths),
        pairs: structuredClone(e.pairs),
      });
      a.history.push(
        `${s.now}: Venue explicitly agreed to version ${a.version}.`,
      );
      return true;
    case "publish":
      actor(c, "organizer", "sample-market-team");
      {
        const issues = publicationIssues(s);
        requireRule(
          !issues.length,
          "PUBLICATION",
          issues.map((i) => i.message).join(" "),
        );
      }
      e.status = "published";
      e.history.push(`${s.now}: Published without creating holds or payments.`);
      return true;
    default:
      return false;
  }
}
