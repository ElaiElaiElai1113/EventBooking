import type { DemoState } from "./model";
import type { Command } from "./commands";
import { actor, requireRule, amount } from "./validation";
import { venueTerms } from "@/demo/fixtures";
import { afterHours, stamp } from "./time";
import { intervalsOverlap } from "./inventory";
export function venueCommand(s: DemoState, c: Command): boolean {
  if (
    !["saveInquiry", "submitInquiry", "declineInquiry", "quote"].includes(
      c.type,
    ) ||
    !("id" in c)
  )
    return false;
  const b = s.bookings.find((b) => b.id === c.id);
  requireRule(b, "BOOKING", "Booking not found.");
  if (c.type === "saveInquiry") {
    actor(c, b.payerRole, b.payerId);
    requireRule(
      !b.submitted,
      "SUBMITTED",
      "Use booking messages for changes after inquiry submission.",
    );
    requireRule(
      s.venues.some((v) => v.id === c.venueId),
      "VENUE",
      "Choose a listed venue.",
    );
    b.draft = structuredClone(c.draft);
    b.venueId = c.venueId;
    return true;
  }
  if (c.type === "submitInquiry") {
    actor(c, b.payerRole, b.payerId);
    const d = b.draft;
    requireRule(
      d.name.trim() &&
        d.contact.includes("@") &&
        d.purpose.trim() &&
        d.package.trim() &&
        d.guests > 0,
      "INQUIRY",
      "Complete your name, contact, purpose, guest count and package.",
    );
    requireRule(
      stamp(d.accessStart) <= stamp(d.start) &&
        stamp(d.start) < stamp(d.end) &&
        stamp(d.end) <= stamp(d.accessEnd),
      "DATES",
      "Setup and cleanup access must contain the event.",
    );
    b.submitted = true;
    b.history.push(`${s.now}: Inquiry received; no reservation or payment.`);
    return true;
  }
  actor(c, "venue", b.venueId);
  if (c.type === "declineInquiry") {
    requireRule(
      !s.agreements.some(
        (a) => a.parentId === b.id && a.allocation !== "released",
      ),
      "HOLD",
      "Resolve the active quote first.",
    );
    requireRule(c.reason.trim(), "REASON", "Give a reason.");
    b.declined = true;
    b.history.push(`${s.now}: Venue declined: ${c.reason}`);
    return true;
  }
  if (c.type === "quote") {
    requireRule(
      b.submitted && !b.declined,
      "INQUIRY",
      "A submitted inquiry is required.",
    );
    amount(c.total);
    amount(c.initial);
    requireRule(
      c.initial <= c.total,
      "AMOUNT",
      "Initial amount cannot exceed the total.",
    );
    const eventStart = c.eventStart ?? b.draft.start;
    const eventEnd = c.eventEnd ?? b.draft.end;
    const setupDuration = stamp(b.draft.start) - stamp(b.draft.accessStart);
    const cleanupDuration = stamp(b.draft.accessEnd) - stamp(b.draft.end);
    requireRule(
      stamp(eventStart) < stamp(eventEnd) &&
        stamp(c.accessStart) <= stamp(eventStart) - setupDuration &&
        stamp(c.accessEnd) >= stamp(eventEnd) + cleanupDuration,
      "DATES",
      "Quote access must include the full requested setup, event and cleanup interval.",
    );
    requireRule(
      stamp(c.balanceDue) < stamp(c.accessStart) &&
        stamp(c.balanceDue) > stamp(afterHours(s.now, 24)),
      "SCHEDULE",
      "Balance due must follow the hold deadline and precede access.",
    );
    const old = s.agreements.filter((a) => a.parentId === b.id).at(-1);
    requireRule(
      !old?.acceptedAt,
      "ACCEPTED",
      "Accepted quote preserved. Record a proposed change in the conversation for customer agreement; do not overwrite it.",
    );
    requireRule(
      !s.agreements.some(
        (a) =>
          a.kind === "venue" &&
          a.venueId === b.venueId &&
          a.parentId !== b.id &&
          a.allocation !== "released" &&
          intervalsOverlap(
            stamp(c.accessStart),
            stamp(c.accessEnd),
            stamp(a.accessStart!),
            stamp(a.accessEnd!),
          ),
      ),
      "CONFLICT",
      "This full access interval overlaps an existing hold or confirmed rental. Propose another time.",
    );
    if (old) {
      old.status = "replaced";
      old.allocation = "released";
    }
    const version = s.agreements.filter((a) => a.parentId === b.id).length + 1;
    const venue = s.venues.find((v) => v.id === b.venueId)!;
    s.agreements.push({
      id: `quote-${b.id}-${version}`,
      kind: "venue",
      parentId: b.id,
      version,
      payerId: b.payerId,
      payerName: b.draft.name,
      recipient: venue.name,
      recipientRole: "venue",
      boothIds: [],
      venueId: b.venueId,
      eventStart,
      eventEnd,
      accessStart: c.accessStart,
      accessEnd: c.accessEnd,
      lineItems: [{ label: c.inclusions, amount: c.total }],
      total: c.total,
      initial: c.initial,
      terms: {
        ...structuredClone(c.terms ?? venueTerms),
        mode: c.initial === c.total ? "full" : "deposit",
        balanceDue: c.balanceDue,
      },
      issuedAt: s.now,
      expiresAt: afterHours(s.now, 24),
      status: "active",
      allocation: "held",
      extensions: [],
      history: [
        `${s.now}: Quote version ${version} sent; whole venue held for full access interval.`,
      ],
    });
    b.history.push(
      `${s.now}: Quote v${version} sent with sample 24-hour hold.`,
    );
    return true;
  }
  return false;
}
