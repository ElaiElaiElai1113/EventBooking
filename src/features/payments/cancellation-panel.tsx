"use client";
import type { Agreement } from "@/domain/model";
import { useDemo } from "@/demo/demo-provider";
import { paid, refundStatus } from "@/domain/selectors";
import { RecordForm } from "@/components/shared/record-form";
import { money, pesos } from "@/domain/money";
import { stamp } from "@/domain/time";
import { Button } from "@/components/ui/button";
export function CancellationPanel({ agreement: a }: { agreement: Agreement }) {
  const { state, dispatch } = useDemo();
  const c = state.cancellations.find((c) => c.agreementId === a.id);
  const receiving = state.role === a.recipientRole;
  const paying = state.identity === a.payerId;
  const exampleRefund =
    stamp(c?.requestedAt ?? state.now) <= stamp(a.terms.refundCutoff)
      ? paid(state, a.id)
      : 0;
  return (
    <details open={!!c}>
      <summary>Cancellation & refund</summary>
      <p className="small">
        Accepted policy v{a.terms.version}: {a.terms.withdrawal}
      </p>
      {!c && paying && a.allocation !== "released" && (
        <RecordForm
          id={`cancel-${a.id}`}
          values={{ reason: "" }}
          fields={[
            {
              name: "reason",
              label: "Cancellation reason",
              required: true,
              full: true,
            },
          ]}
          submit="Request cancellation"
          onSubmit={(v) =>
            dispatch({
              type: "requestCancellation",
              id: a.id,
              reason: v.reason,
            })
          }
        />
      )}{" "}
      {c && (
        <>
          <p>
            Cancellation: <strong>{c.status}</strong> — {c.reason}
          </p>
          <p className="small">
            {c.decision ||
              "The receiving business must decide. Request alone does not release inventory."}
          </p>
          {receiving && c.status === "requested" && (
            <>
              <RecordForm
                id={`decision-${a.id}`}
                values={{
                  reason:
                    "Timely withdrawal under the illustrative accepted policy",
                  refund: String(exampleRefund / 100),
                }}
                fields={[
                  {
                    name: "reason",
                    label: "Cancellation decision reason",
                    required: true,
                    full: true,
                  },
                  {
                    name: "refund",
                    label: "Refund due (PHP)",
                    type: "number",
                    required: true,
                  },
                ]}
                submit="Confirm cancellation"
                onSubmit={(v) =>
                  dispatch({
                    type: "decideCancellation",
                    id: a.id,
                    confirm: true,
                    reason: v.reason,
                    refund: pesos(v.refund),
                  })
                }
              />
              <Button
                variant="ghost"
                onClick={() =>
                  dispatch({
                    type: "decideCancellation",
                    id: a.id,
                    confirm: false,
                    reason:
                      "Staff declined this sample request; contact the recipient to discuss.",
                    refund: 0,
                  })
                }
              >
                Decline cancellation request
              </Button>
            </>
          )}
          <p data-testid="refund-status">{refundStatus(state, a.id)}</p>
          {c.status === "confirmed" && (
            <>
              <p className="small">
                Refund due {money(c.refundDue)}. Recording a refund does not
                send money.
              </p>
              {c.refunds.map((r) => (
                <p key={r.reference}>
                  {r.reference}: {money(r.amount)}
                </p>
              ))}
              {receiving &&
                c.refunds.reduce((n, r) => n + r.amount, 0) < c.refundDue && (
                  <RecordForm
                    id={`refund-${a.id}-${c.refunds.length}`}
                    values={{
                      reference: "",
                      amount: String(
                        (c.refundDue -
                          c.refunds.reduce((n, r) => n + r.amount, 0)) /
                          100,
                      ),
                    }}
                    fields={[
                      {
                        name: "reference",
                        label: "Refund reference",
                        required: true,
                      },
                      {
                        name: "amount",
                        label: "Refund amount (PHP)",
                        type: "number",
                        required: true,
                      },
                    ]}
                    submit="Record sample refund"
                    onSubmit={(v) =>
                      dispatch({
                        type: "refund",
                        id: a.id,
                        reference: v.reference,
                        amount: pesos(v.amount),
                      })
                    }
                  />
                )}
            </>
          )}
        </>
      )}
    </details>
  );
}
