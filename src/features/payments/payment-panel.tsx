"use client";
import { useState } from "react";
import { useDemo } from "@/demo/demo-provider";
import type { Agreement } from "@/domain/model";
import {
  agreementStatus,
  balance,
  paid,
  reviewOverdue,
  unresolved,
} from "@/domain/selectors";
import {
  dateTime,
  localInput,
  fromInput,
  afterHours,
  stamp,
} from "@/domain/time";
import { money, pesos } from "@/domain/money";
import { RecordForm } from "@/components/shared/record-form";
import { Button } from "@/components/ui/button";
import { History, Notice, TermsView, Status } from "@/components/shared/common";
import { CancellationPanel } from "./cancellation-panel";
export function PaymentPanel({ agreement: a }: { agreement: Agreement }) {
  const { state, dispatch } = useDemo();
  const [accepted, setAccepted] = useState(false);
  const receiving =
    state.role === a.recipientRole &&
    (a.kind === "merchant"
      ? state.identity === "sample-market-team"
      : state.identity === a.venueId);
  const paying = state.identity === a.payerId;
  const receipts = state.receipts.filter((r) => r.agreementId === a.id);
  const status = agreementStatus(state, a);
  return (
    <section className="panel payment-panel">
      <div className="spread">
        <p className="eyebrow">
          {a.kind === "venue" ? "VENUE QUOTE" : "EXACT BOOTH OFFER"} · VERSION{" "}
          {a.version}
        </p>
        <Status>
          <span
            data-testid={
              a.kind === "venue" ? "booking-status" : "application-status"
            }
          >
            {status}
          </span>
        </Status>
      </div>
      <h2 data-testid="allocation-summary">
        {a.kind === "merchant"
          ? `Booths ${a.boothIds.join(" + ")}`
          : a.recipient}
      </h2>
      <p className="small">
        Allocation:{" "}
        <strong data-testid="allocation-state">
          {a.allocation === "held"
            ? "Held"
            : a.allocation === "confirmed"
              ? "Confirmed"
              : "Released"}
        </strong>
      </p>
      {a.kind === "venue" && (
        <p>
          Reserved access: {dateTime(a.accessStart!)} — {dateTime(a.accessEnd!)}
          . Includes setup and cleanup.
        </p>
      )}
      {a.kind === "venue" && a.eventStart && a.eventEnd && (
        <p>
          Quoted event: {dateTime(a.eventStart)} — {dateTime(a.eventEnd)}.
          Review these exact dates before accepting.
        </p>
      )}
      <div className="money-rows">
        {a.lineItems.map((x, i) => (
          <div key={i}>
            <span>{x.label}</span>
            <span>{money(x.amount)}</span>
          </div>
        ))}
        <div className="total">
          <span>Total</span>
          <span>{money(a.total)}</span>
        </div>
        <div>
          <span>Required initial payment</span>
          <strong>{money(a.initial)}</strong>
        </div>
        <div>
          <span>Verified received</span>
          <span>{money(paid(state, a.id))}</span>
        </div>
        <div>
          <span>Collectible balance</span>
          <strong data-testid="collectible-balance">
            {money(balance(state, a))}
          </strong>
        </div>
      </div>
      <p>
        <strong>Payee: {a.recipient}</strong>
        <br />
        <span className="small">
          Payer: {a.payerName}. The receiving business verifies receipt.
        </span>
      </p>
      <p className="small">
        Accept and submit the required initial payment by{" "}
        <strong>{dateTime(a.expiresAt)}</strong>.{" "}
        {a.kind === "venue"
          ? "Sample venue-set 24-hour hold."
          : "Default merchant offer window: 48 hours."}{" "}
        Acceptance does not restart this clock.
      </p>
      {a.terms.mode === "deposit" && (
        <p className="small">
          Balance due {dateTime(a.terms.balanceDue)}
          {balance(state, a) > 0 &&
          a.status === "confirmed" &&
          stamp(state.now) > stamp(a.terms.balanceDue)
            ? " · Overdue — staff follow-up required; no automatic cancellation."
            : ""}
        </p>
      )}
      {reviewOverdue(state, a) && (
        <Notice>
          Timely proof is awaiting staff review after the deadline. The complete
          allocation remains held. Follow up; review delay does not release it.
        </Notice>
      )}
      {a.acceptedAt && (
        <p className="small">
          Accepted version {a.version} on {dateTime(a.acceptedAt)}. This
          snapshot remains unchanged.
        </p>
      )}
      {a.contextSnapshot && (
        <details>
          <summary>Offered event & booth arrangement</summary>
          <p>
            {a.contextSnapshot.eventName}
            <br />
            {dateTime(a.contextSnapshot.start)} —{" "}
            {dateTime(a.contextSnapshot.end)}
          </p>
          <p>
            Setup: {dateTime(a.contextSnapshot.setup)} · arrangement v
            {a.contextSnapshot.arrangementVersion}
          </p>
          <p>{a.contextSnapshot.rules}</p>
          {a.contextSnapshot.booths.map((b) => (
            <p key={b.id}>
              Booth {b.id}: {b.width} × {b.depth}m. {b.inclusions}.{" "}
              {b.power ? `Power up to ${b.watts}W` : "No power"}.
            </p>
          ))}
        </details>
      )}
      <details>
        <summary>Read exact accepted / offered terms</summary>
        {a.kind === "merchant" ? (
          <TermsView terms={a.terms} />
        ) : (
          <>
            <p>{a.terms.withdrawal}</p>
            <p>{a.terms.organizerCancellation}</p>
          </>
        )}
      </details>
      {paying && a.status === "active" && (
        <div className="stack">
          <label className="check">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            {a.kind === "venue"
              ? "I accept this quote and its terms"
              : "I accept this exact offer and its terms"}
          </label>
          <Button
            disabled={!accepted}
            onClick={() => dispatch({ type: "accept", id: a.id })}
          >
            {a.kind === "venue" ? "Accept quote" : "Accept offer"}
          </Button>
        </div>
      )}
      {paying &&
        a.acceptedAt &&
        a.status !== "canceled" &&
        balance(state, a) > 0 && (
          <details
            open={a.status === "accepted" && !unresolved(state, a.id).length}
          >
            <summary>Submit a sample payment reference</summary>
            <Notice>{a.terms.instructions} Proof is not verification.</Notice>
            <RecordForm
              key={a.id + "-" + receipts.length}
              id={`payment-${a.id}-${receipts.length}`}
              fields={[
                {
                  name: "reference",
                  label: "Payment reference",
                  required: true,
                },
                {
                  name: "amount",
                  label: "Amount paid (PHP)",
                  type: "number",
                  required: true,
                },
              ]}
              values={{
                reference: "",
                amount: String(
                  Math.max(0, a.initial - paid(state, a.id)) / 100 ||
                    balance(state, a) / 100,
                ),
              }}
              submit="Submit sample payment"
              onSubmit={(v) =>
                dispatch({
                  type: "submitReceipt",
                  id: a.id,
                  reference: v.reference,
                  amount: pesos(v.amount),
                })
              }
            />
          </details>
        )}
      {receipts.map((r) => (
        <div className="receipt" key={r.id}>
          <div className="spread">
            <h3>{r.reference}</h3>
            <Status>{r.status}</Status>
          </div>
          <p className="small">
            Claimed {money(r.claimed)} · verified {money(r.verified)}
            <br />
            {dateTime(r.submittedAt)} ·{" "}
            {r.timely ? "Timely proof" : "Outside initial hold window"}
          </p>
          {r.reason && <p className="small">{r.reason}</p>}
          {receiving &&
            (r.status === "submitted" || r.status === "needs-resolution") && (
              <RecordForm
                id={`verify-${r.id}`}
                values={{
                  decision: "verify",
                  amount: String(r.claimed / 100),
                  reason: "Sample receipt matched to this agreement",
                }}
                fields={[
                  {
                    name: "decision",
                    label: "Receipt decision",
                    required: true,
                    options: [
                      { value: "verify", label: "Verify matching receipt" },
                      {
                        value: "resolve",
                        label: "Needs resolution / unclear / unmatched",
                      },
                      { value: "reject", label: "Reject receipt" },
                    ],
                  },
                  {
                    name: "amount",
                    label: "Verified amount (PHP)",
                    required: true,
                    type: "number",
                  },
                  {
                    name: "reason",
                    label: "Review reason",
                    required: true,
                    full: true,
                  },
                ]}
                submit="Record receipt decision"
                onSubmit={(v) =>
                  dispatch({
                    type: "reviewReceipt",
                    id: r.id,
                    decision: v.decision as "verify" | "resolve" | "reject",
                    amount: pesos(v.amount),
                    reason: v.reason,
                  })
                }
              />
            )}
        </div>
      ))}
      {paying &&
        ["active", "accepted"].includes(a.status) &&
        !receipts.length && (
          <Button
            variant="ghost"
            onClick={() => dispatch({ type: "decline", id: a.id })}
          >
            Decline unpaid {a.kind === "venue" ? "quote" : "offer"}
          </Button>
        )}
      {receiving && a.allocation === "held" && (
        <details>
          <summary>Extend deadline explicitly</summary>
          <RecordForm
            id={`extend-${a.id}-${a.expiresAt}`}
            values={{
              until: localInput(afterHours(a.expiresAt, 24)),
              reason: "",
            }}
            fields={[
              {
                name: "until",
                label: "New deadline (Philippine time)",
                type: "datetime-local",
                required: true,
              },
              { name: "reason", label: "Extension reason", required: true },
            ]}
            submit="Extend deadline"
            onSubmit={(v) =>
              dispatch({
                type: "extend",
                id: a.id,
                until: fromInput(v.until),
                reason: v.reason,
              })
            }
          />
        </details>
      )}
      {(a.acceptedAt || receipts.length > 0) && (
        <CancellationPanel agreement={a} />
      )}
      <History items={a.history} />
    </section>
  );
}
