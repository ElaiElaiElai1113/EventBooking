import type { DemoState, Role, Agreement } from "./model";
import { latestAgreement, balance, unresolved } from "./selectors";
import { publicationIssues } from "./publication";
import { stamp } from "./time";

export type Journey = {
  stage: string;
  detail: string;
  steps: string[];
  step: number;
  role?: Role;
  identity?: string;
  href?: string;
  deadline?: string;
};
const bookingSteps = ["Inquiry", "Quote", "Payment review", "Confirmed"];
const merchantSteps = [
  "Application",
  "Selection",
  "Offer",
  "Payment review",
  "Confirmed",
];
const eventSteps = ["Prepare", "Venue review", "Agreement", "Publish"];

function agreementJourney(
  s: DemoState,
  a: Agreement,
  payerRole: Role,
): Journey {
  const merchant = a.kind === "merchant";
  const steps = merchant ? merchantSteps : bookingSteps;
  const payer = {
    role: payerRole,
    identity: a.payerId,
    href: merchant ? `/applications/${a.parentId}` : `/bookings/${a.parentId}`,
  };
  const recipient = {
    role: a.recipientRole,
    identity: merchant ? "sample-market-team" : a.venueId!,
    href: merchant
      ? `/organizer/events/${s.event.id}/applications?application=${encodeURIComponent(a.parentId)}`
      : `/bookings/${a.parentId}`,
  };
  const base = { steps, step: merchant ? 2 : 1 };
  const cancellation = s.cancellations.find((c) => c.agreementId === a.id);
  if (cancellation?.status === "requested")
    return {
      ...base,
      ...recipient,
      stage: "Cancellation requested",
      detail:
        "The receiving business must decide the request. The allocation is unchanged until that decision.",
    };
  if (a.status === "canceled") {
    const due =
      cancellation &&
      cancellation.refundDue >
        cancellation.refunds.reduce((sum, r) => sum + r.amount, 0);
    return {
      ...base,
      ...(due ? recipient : {}),
      stage: due ? "Refund to record" : "Canceled",
      detail: due
        ? "The allocation is released. Record the separate fictional refund in the cancellation panel."
        : "The allocation is released. Review the cancellation decision and refund record below.",
    };
  }
  if (["expired", "declined", "replaced"].includes(a.status))
    return {
      ...base,
      stage: `Offer ${a.status}`,
      detail:
        "This offer cannot be accepted or paid. Review the record below and discuss any new offer with the receiving business.",
    };
  const pending = unresolved(s, a.id);
  if (pending.some((r) => r.status === "submitted"))
    return {
      ...base,
      ...recipient,
      step: steps.length - (a.status === "confirmed" ? 1 : 2),
      stage: a.status === "confirmed" ? "Balance payment review" : "Payment review",
      detail: a.status === "confirmed"
        ? "Verify the fictional balance receipt below. The existing booking or allocation remains confirmed."
        : "Verify the fictional receipt below. Submitting proof does not confirm the booking or allocation.",
    };
  if (pending.length)
    return {
      ...base,
      ...payer,
      step: steps.length - (a.status === "confirmed" ? 1 : 2),
      stage: "Payment needs attention",
      detail:
        "Read the receipt feedback and provide a corrected fictional reference below. The current allocation stays protected while unresolved.",
    };
  if (a.status === "confirmed")
    return {
      ...base,
      ...(balance(s, a) > 0 ? payer : {}),
      step: steps.length - 1,
      stage:
        balance(s, a) > 0
          ? "Confirmed · balance due"
          : "Confirmed · fully paid",
      detail:
        balance(s, a) > 0
          ? "Your allocation is confirmed. Submit the remaining balance using the accepted terms below."
          : "Your allocation is confirmed. Review your accepted dates, setup instructions and receipt history.",
      ...(balance(s, a) > 0 ? { deadline: a.terms.balanceDue } : {}),
    };
  return {
    ...base,
    ...payer,
    stage: a.acceptedAt ? "Payment due" : "Review your offer",
    detail: a.acceptedAt
      ? "Submit the required fictional payment reference below. The receiving business verifies it before confirmation."
      : "Review the exact dates, allocation and terms below, then explicitly accept this version.",
    deadline: a.expiresAt,
  };
}

export function journeyFor(s: DemoState, id: string): Journey | undefined {
  const b = s.bookings.find((b) => b.id === id);
  const app = s.applications.find((a) => a.id === id);
  const agreement = latestAgreement(s, id);
  if (agreement && (b || app))
    return agreementJourney(s, agreement, b?.payerRole ?? "merchant");
  if (b)
    return {
      steps: bookingSteps,
      step: 0,
      stage: b.declined
        ? "Inquiry declined"
        : b.submitted
          ? "Awaiting venue response"
          : "Draft inquiry",
      detail: b.declined
        ? "No space is held. Discuss a different date or venue before continuing."
        : b.submitted
          ? "The venue reviews your requested dates and sends a quote. No space is held yet."
          : "Complete and send your inquiry from the venue page. Nothing is reserved.",
      ...(!b.declined
        ? {
            role: b.submitted ? ("venue" as const) : b.payerRole,
            identity: b.submitted ? b.venueId : b.payerId,
            href: b.submitted ? `/bookings/${b.id}` : `/venues/${b.venueId}`,
          }
        : {}),
    };
  if (app) {
    const needsMerchant =
      app.status === "draft" || app.status === "clarification";
    const closed = ["withdrawn", "declined"].includes(app.status);
    return {
      steps: merchantSteps,
      step: needsMerchant ? 0 : 1,
      stage:
        app.status === "draft"
          ? "Draft application"
          : app.status === "clarification"
            ? "Clarification requested"
            : app.status === "waitlisted"
              ? "Waitlisted"
              : closed
                ? `Application ${app.status}`
                : "Awaiting selection",
      detail: needsMerchant
        ? "Complete or correct the same application. Your ranked booth preferences stay with it."
        : closed
          ? "No booth is reserved. The record remains available for reference."
          : stamp(s.now) < stamp(s.event.closes)
            ? "The organizer can review applications now. Offers open after applications close; applying reserves no booth."
            : "The organizer reviews this application and can make an exact offer. Waitlisting or shortlisting reserves no booth.",
      ...(!closed
        ? {
            role: needsMerchant
              ? ("merchant" as const)
              : ("organizer" as const),
            identity: needsMerchant ? app.businessId : "sample-market-team",
            href: needsMerchant
              ? `/events/${app.eventId}/apply`
              : `/organizer/events/${app.eventId}/applications?application=${encodeURIComponent(app.id)}`,
            deadline: needsMerchant ? s.event.closes : s.event.decisions,
          }
        : {}),
    };
  }
  if (id !== s.event.id) return undefined;
  const e = s.event,
    a = e.arrangement;
  const organizer = {
    role: "organizer" as const,
    identity: "sample-market-team",
    href: `/organizer/events/${e.id}/setup`,
  };
  const venue = {
    role: "venue" as const,
    identity: "sample-hall",
    href: `/venue/events/${e.id}/review`,
  };
  const base = { steps: eventSteps };
  if (e.status === "published")
    return {
      ...base,
      step: 3,
      stage: "Published",
      detail:
        "Your event is visible to merchants. Publication does not reserve booths or collect payment.",
      ...organizer,
      href: `/organizer/events/${e.id}/applications`,
      deadline: e.closes,
    };
  const missing = a.packet.find(
    (p) => p.required && p.applicable && (!p.supplied || p.change),
  );
  if (missing)
    return {
      ...base,
      step: 0,
      stage: "Prepare the review packet",
      detail: `${missing.title}: ${missing.change || "supply the current sample document"}. Open Venue & layout to prepare the packet.`,
      ...(missing.owner === "venue" ? venue : organizer),
    };
  if (
    a.packet.some(
      (p) => p.required && p.applicable && p.reviewedVersion !== p.version,
    )
  )
    return {
      ...base,
      ...venue,
      step: 1,
      stage: "Venue review",
      detail:
        "Review the current required packet items. Reviewing documents is separate from agreeing to the arrangement.",
    };
  if (a.agreedVersion !== a.version)
    return {
      ...base,
      ...venue,
      step: 2,
      stage: "Venue agreement",
      detail: `Explicitly agree to arrangement v${a.version}. An older agreement or a meeting does not approve this version.`,
    };
  const issues = publicationIssues(s);
  return {
    ...base,
    ...organizer,
    step: 3,
    stage: issues.length ? "Finish publication checks" : "Ready to publish",
    detail: issues.length
      ? issues[0].message
      : "The current agreement and checks are complete. Open Preview & publish to make the event visible.",
  };
}
