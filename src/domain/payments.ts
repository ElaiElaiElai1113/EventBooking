import type { DemoState } from "./model";
import type { Command } from "./commands";
import { agreement, payer, receiver, amount, requireRule } from "./validation";
import { paid } from "./selectors";
import { stamp } from "./time";
export function paymentCommand(s: DemoState, c: Command): boolean {
  if (c.type === "submitReceipt") {
    const a = agreement(s, c.id);
    payer(c, a);
    amount(c.amount);
    requireRule(
      a.acceptedAt && a.status !== "canceled",
      "ACCEPT",
      "Accept the exact quote or offer before submitting payment.",
    );
    requireRule(
      c.reference.trim(),
      "REFERENCE",
      "Enter a fictional payment reference.",
    );
    const duplicate = s.receipts.some(
      (r) =>
        r.reference.trim().toLowerCase() === c.reference.trim().toLowerCase() &&
        r.recipient === a.recipient &&
        r.status !== "rejected",
    );
    const timely =
      a.allocation !== "released" && stamp(s.now) < stamp(a.expiresAt);
    s.receipts.push({
      id: `receipt-${s.revision + 1}`,
      agreementId: a.id,
      payerId: a.payerId,
      recipient: a.recipient,
      reference: c.reference.trim(),
      claimed: c.amount,
      verified: 0,
      submittedAt: s.now,
      timely,
      status:
        duplicate || (!timely && a.status !== "confirmed")
          ? "needs-resolution"
          : "submitted",
      reason: duplicate
        ? "Duplicate reference; no second credit."
        : !timely && a.status !== "confirmed"
          ? "Late receipt requires resolution; it cannot reclaim a released allocation."
          : "",
    });
    a.history.push(
      `${s.now}: Sample payment reference submitted; not verified.`,
    );
    return true;
  }
  if (c.type === "reviewReceipt") {
    const r = s.receipts.find((r) => r.id === c.id);
    requireRule(r, "RECEIPT", "Receipt not found.");
    const a = agreement(s, r.agreementId);
    receiver(c, a);
    requireRule(
      r.status !== "verified" && r.status !== "rejected",
      "REVIEWED",
      "This receipt already has a final decision.",
    );
    requireRule(
      c.reason.trim(),
      "REASON",
      "Record the verification or resolution reason.",
    );
    if (c.decision === "verify") {
      amount(c.amount);
      requireRule(
        c.amount <= r.claimed,
        "AMOUNT",
        "Verified amount cannot exceed the submitted claim.",
      );
      requireRule(
        a.acceptedAt && a.allocation !== "released" && a.status !== "canceled",
        "ALLOCATION",
        "No valid accepted allocation remains. Resolve the late receipt without reclaiming inventory.",
      );
      requireRule(
        !s.receipts.some(
          (other) =>
            other.id !== r.id &&
            other.reference.toLowerCase() === r.reference.toLowerCase() &&
            other.recipient === r.recipient &&
            other.status !== "rejected",
        ),
        "DUPLICATE",
        "Resolve the duplicate reference before crediting money.",
      );
      requireRule(
        paid(s, a.id) + c.amount <= a.total,
        "OVERPAYMENT",
        "Amount exceeds the agreement total; record resolution instead.",
      );
      r.verified = c.amount;
      r.status = "verified";
      r.reason = c.reason;
      if (paid(s, a.id) >= a.initial) {
        a.status = "confirmed";
        a.allocation = "confirmed";
        a.history.push(
          `${s.now}: Receiving business verified required receipt; allocation confirmed.`,
        );
      } else
        a.history.push(
          `${s.now}: Partial receipt verified; required initial payment still incomplete.`,
        );
    } else {
      r.status = c.decision === "reject" ? "rejected" : "needs-resolution";
      r.reason = c.reason;
    }
    return true;
  }
  return false;
}
