"use client";
import type { Application } from "@/domain/model";
import { useDemo } from "@/demo/demo-provider";
import { JourneyProgress } from "@/components/shared/journey-progress";
import { RecordForm } from "@/components/shared/record-form";
import { Button } from "@/components/ui/button";
import { PaymentPanel } from "@/features/payments/payment-panel";
import { CoordinationPanel } from "@/features/events/coordination-panel";
import { latestAgreement } from "@/domain/selectors";
import { OfferEditor } from "./offer-editor";
export function ReviewActions({
  application: a,
}: {
  application: Application;
}) {
  const { state, dispatch } = useDemo();
  const offer = latestAgreement(state, a.id);
  return (
    <div className="stack">
      <JourneyProgress id={a.id} />
      <OfferEditor key={a.id} application={a} />
      {offer && <PaymentPanel key={offer.id} agreement={offer} />}
      <div className="action-row">
        <Button
          variant="outline"
          onClick={() =>
            dispatch({
              type: "reviewApplication",
              id: a.id,
              decision: "shortlist",
              text: "",
            })
          }
        >
          {a.shortlisted ? "Remove from shortlist" : "Shortlist internally"}
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            dispatch({
              type: "reviewApplication",
              id: a.id,
              decision: "waitlist",
              text: "No suitable offer at this time.",
            })
          }
        >
          Waitlist
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            dispatch({
              type: "reviewApplication",
              id: a.id,
              decision: "decline",
              text: "Not selected for this edition.",
            })
          }
        >
          Decline application
        </Button>
      </div>
      <details>
        <summary>Internal notes & clarification</summary>
        <RecordForm
          key={a.id + "notes"}
          id={`notes-${a.id}`}
          values={{ notes: a.notes }}
          fields={[
            {
              name: "notes",
              label: "Organizer-only notes",
              type: "textarea",
              full: true,
            },
          ]}
          submit="Save internal notes"
          onSubmit={(v) =>
            dispatch({
              type: "reviewApplication",
              id: a.id,
              decision: "note",
              text: v.notes,
            })
          }
        />
        <RecordForm
          key={a.id + "question"}
          id={`question-${a.id}`}
          values={{ question: "" }}
          fields={[
            {
              name: "question",
              label: "Clarification question",
              type: "textarea",
              full: true,
              required: true,
            },
          ]}
          submit="Request clarification"
          onSubmit={(v) =>
            dispatch({
              type: "reviewApplication",
              id: a.id,
              decision: "clarify",
              text: v.question,
            })
          }
        />
      </details>
      <CoordinationPanel context={a.id} />
      {state.agreements
        .filter((g) => g.parentId === a.id && g.id !== offer?.id)
        .map((g) => (
          <details key={g.id}>
            <summary>
              Previous offer v{g.version} · {g.status}
            </summary>
            <PaymentPanel key={g.id} agreement={g} />
          </details>
        ))}
    </div>
  );
}
