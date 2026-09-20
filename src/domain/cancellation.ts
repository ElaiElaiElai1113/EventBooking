import type { DemoState } from "./model";
import type { Command } from "./commands";
import { agreement, payer, receiver, amount, requireRule } from "./validation";
import { paid } from "./selectors";
export function cancellationCommand(s: DemoState, c: Command): boolean {
  if (
    c.type !== "requestCancellation" &&
    c.type !== "decideCancellation" &&
    c.type !== "refund"
  )
    return false;
  const a = agreement(s, c.id);
  const existing = s.cancellations.find((x) => x.agreementId === a.id);
  if (c.type === "requestCancellation") {
    payer(c, a);
    requireRule(
      a.allocation !== "released" &&
        (a.acceptedAt || s.receipts.some((r) => r.agreementId === a.id)),
      "CANCEL",
      "Use unpaid decline for an unaccepted offer.",
    );
    requireRule(
      !existing || existing.status === "declined",
      "CANCEL",
      "A cancellation is already open or confirmed.",
    );
    requireRule(c.reason.trim(), "REASON", "Explain the request.");
    if (existing) s.cancellations.splice(s.cancellations.indexOf(existing), 1);
    s.cancellations.push({
      agreementId: a.id,
      requestedAt: s.now,
      reason: c.reason,
      status: "requested",
      decision: "",
      refundDue: 0,
      refunds: [],
    });
    a.history.push(`${s.now}: Cancellation requested; allocation retained.`);
    return true;
  }
  receiver(c, a);
  requireRule(existing, "CANCEL", "A cancellation request is required.");
  if (c.type === "decideCancellation") {
    requireRule(
      existing.status === "requested" && c.reason.trim(),
      "CANCEL",
      "Record a decision and reason on the pending request.",
    );
    requireRule(
      Number.isSafeInteger(c.refund) &&
        c.refund >= 0 &&
        c.refund <= paid(s, a.id),
      "REFUND",
      "Refund due must be between zero and the verified fees paid.",
    );
    existing.status = c.confirm ? "confirmed" : "declined";
    existing.decidedAt = s.now;
    existing.decision = c.reason;
    if (c.confirm) {
      existing.refundDue = c.refund;
      a.status = "canceled";
      a.allocation = "released";
      a.history.push(
        `${s.now}: Staff confirmed cancellation; whole allocation released; future balance stopped. Refund remains separate.`,
      );
    }
    return true;
  }
  requireRule(
    existing.status === "confirmed",
    "REFUND",
    "Confirm the cancellation before recording refunds.",
  );
  amount(c.amount);
  requireRule(
    c.reference.trim() &&
      !existing.refunds.some(
        (r) => r.reference.toLowerCase() === c.reference.trim().toLowerCase(),
      ),
    "REFERENCE",
    "Use a unique sample refund reference.",
  );
  requireRule(
    existing.refunds.reduce((n, r) => n + r.amount, 0) + c.amount <=
      existing.refundDue,
    "REFUND",
    "Refund entries cannot exceed the amount due.",
  );
  existing.refunds.push({
    reference: c.reference.trim(),
    amount: c.amount,
    at: s.now,
  });
  return true;
}
