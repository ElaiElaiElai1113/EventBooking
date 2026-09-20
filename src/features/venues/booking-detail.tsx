"use client";
import { useDemo } from "@/demo/demo-provider";
import {
  PageHeading,
  RoleGate,
  History,
  Notice,
  Back,
} from "@/components/shared/common";
import { latestAgreement } from "@/domain/selectors";
import { PaymentPanel } from "@/features/payments/payment-panel";
import { CoordinationPanel } from "@/features/events/coordination-panel";
import { dateTime } from "@/domain/time";
import { QuoteForm } from "./quote-form";
import { Button } from "@/components/ui/button";
export function BookingDetail({
  id,
  embedded = false,
}: {
  id: string;
  embedded?: boolean;
}) {
  const { state, dispatch } = useDemo();
  const b = state.bookings.find((b) => b.id === id);
  if (!b)
    return (
      <div className="container">
        <h1>Booking not found</h1>
        <Back href="/venues">Find a venue</Back>
      </div>
    );
  const a = latestAgreement(state, id);
  const allowed =
    state.role === "venue"
      ? state.identity === b.venueId
      : state.identity === b.payerId;
  return (
    <RoleGate
      roles={["venue", b.payerRole]}
      identity={allowed ? undefined : "matching-booking-participant"}
    >
      <div className={embedded ? "" : "container"}>
        {!embedded && (
          <PageHeading
            eyebrow={`BOOKING · ${b.id}`}
            title={b.draft.purpose}
            description={`${b.draft.name} · ${state.venues.find((v) => v.id === b.venueId)?.name}`}
          />
        )}
        <div className={embedded ? "stack" : "two-columns"}>
          <section className="panel">
            <h2>{b.draft.name}&apos;s inquiry</h2>
            <p>
              {b.draft.guests} guests · {b.draft.package}
            </p>
            <p>
              Event: {dateTime(b.draft.start)} — {dateTime(b.draft.end)}
            </p>
            <p>
              Access requested: {dateTime(b.draft.accessStart)} —{" "}
              {dateTime(b.draft.accessEnd)}
            </p>
            <p>{b.draft.needs}</p>
            <p className="small">Sample contact: {b.draft.contact}</p>
            {!a && (
              <Notice>
                {b.declined
                  ? "The venue declined this request."
                  : b.submitted
                    ? "Inquiry received. Awaiting venue response. No reservation has been made."
                    : "Draft inquiry. Nothing has been sent or held."}
              </Notice>
            )}
            <CoordinationPanel context={b.id} />
            <History items={b.history} />
            {state.role === "venue" && b.submitted && !a && !b.declined && (
              <Button
                variant="ghost"
                onClick={() =>
                  dispatch({
                    type: "declineInquiry",
                    id: b.id,
                    reason:
                      "Venue cannot accommodate this sample request; please discuss another date.",
                  })
                }
              >
                Decline inquiry
              </Button>
            )}
          </section>
          <div className="stack">
            {a && <PaymentPanel key={a.id} agreement={a} />}{" "}
            {state.role === "venue" &&
              b.submitted &&
              !b.declined &&
              (!a || !a.acceptedAt) && <QuoteForm booking={b} />}{" "}
            {state.role === "venue" && a?.acceptedAt && (
              <Notice>
                Accepted quote v{a.version} is preserved. Propose material
                changes in the booking conversation for a new customer
                agreement; no silent rewrite.
              </Notice>
            )}{" "}
            {state.agreements
              .filter((g) => g.parentId === id && g.id !== a?.id)
              .map((g) => (
                <details key={g.id}>
                  <summary>
                    Previous quote v{g.version} · {g.status}
                  </summary>
                  <PaymentPanel key={g.id} agreement={g} />
                </details>
              ))}
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
