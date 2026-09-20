import type { DemoState, Agreement } from "./model";
import { stamp } from "./time";
export const latestAgreement = (s: DemoState, parent: string) =>
  s.agreements.filter((a) => a.parentId === parent).at(-1);
export const paid = (s: DemoState, id: string) =>
  s.receipts
    .filter((r) => r.agreementId === id && r.status === "verified")
    .reduce((n, r) => n + r.verified, 0);
export const balance = (s: DemoState, a: Agreement) =>
  a.status === "canceled" ? 0 : Math.max(0, a.total - paid(s, a.id));
export const unresolved = (s: DemoState, id: string) =>
  s.receipts.filter(
    (r) =>
      r.agreementId === id &&
      (r.status === "submitted" || r.status === "needs-resolution"),
  );
export const boothState = (s: DemoState, id: string) =>
  s.event.booths.find((b) => b.id === id)?.unavailable
    ? "Unavailable"
    : s.agreements.find(
          (a) =>
            a.kind === "merchant" &&
            a.allocation !== "released" &&
            a.boothIds.includes(id),
        )?.allocation === "confirmed"
      ? "Confirmed"
      : s.agreements.some(
            (a) =>
              a.kind === "merchant" &&
              a.allocation === "held" &&
              a.boothIds.includes(id),
          )
        ? "Held"
        : "Accepting preferences";
export function agreementStatus(s: DemoState, a?: Agreement) {
  if (!a) return "No offer";
  if (a.status === "canceled") return "Canceled";
  if (
    s.cancellations.some(
      (c) => c.agreementId === a.id && c.status === "requested",
    )
  )
    return "Cancellation requested";
  if (a.status === "confirmed")
    return balance(s, a) ? "Confirmed · balance due" : "Confirmed · fully paid";
  if (unresolved(s, a.id).length) return "Payment under review";
  if (a.status === "expired") return "Offer expired";
  if (a.status === "declined") return "Offer declined";
  if (a.status === "replaced") return "Replaced";
  return a.acceptedAt ? "Payment due" : "Offer received";
}
export const reviewOverdue = (s: DemoState, a: Agreement) =>
  unresolved(s, a.id).some((r) => r.timely) &&
  stamp(s.now) >= stamp(a.expiresAt);
export function refundStatus(s: DemoState, id: string) {
  const c = s.cancellations.find((c) => c.agreementId === id);
  if (!c || c.status !== "confirmed") return "Not decided";
  const sum = c.refunds.reduce((n, r) => n + r.amount, 0);
  return c.refundDue === 0
    ? "Refund not due"
    : sum === c.refundDue
      ? "Refund recorded"
      : sum
        ? "Refund partially recorded"
        : "Refund due";
}
