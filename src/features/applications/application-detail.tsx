"use client";
import { useDemo } from "@/demo/demo-provider";
import {
  PageHeading,
  RoleGate,
  History,
  Notice,
  ActionLink,
} from "@/components/shared/common";
import { latestAgreement, boothState } from "@/domain/selectors";
import { PaymentPanel } from "@/features/payments/payment-panel";
import { CoordinationPanel } from "@/features/events/coordination-panel";
import { dateTime } from "@/domain/time";
import { Button } from "@/components/ui/button";
export function ApplicationDetail({ id }: { id: string }) {
  const { state, dispatch } = useDemo();
  const a = state.applications.find((a) => a.id === id);
  if (!a)
    return (
      <div className="container">
        <h1>Application not found</h1>
      </div>
    );
  const offer = latestAgreement(state, id);
  const data = a.snapshots.at(-1)?.data ?? a.draft;
  return (
    <RoleGate roles={["merchant"]} identity={a.businessId}>
      <div className="container">
        <PageHeading
          eyebrow="SAMPLE DAVAO MAKERS MARKET"
          title={
            offer
              ? "Your place at the market."
              : "Your application, all in one place."
          }
          description="Same application. Clear next steps. No need to start again when a preference is taken."
        />
        <p data-testid="application-reference" className="small muted">
          Application reference: {a.id}
        </p>
        <div className="two-columns">
          <section className="panel">
            <h2>{data.name}</h2>
            <p>
              {data.category} ·{" "}
              {data.quantity === 2
                ? "Two adjacent booths requested"
                : "One booth requested"}
            </p>
            <p>{data.products}</p>
            <p>{data.needs}</p>
            {!offer && (
              <Notice>
                <strong data-testid="application-status">
                  {a.status === "submitted"
                    ? "Application submitted"
                    : a.status === "waitlisted"
                      ? "Waitlisted"
                      : a.status === "clarification"
                        ? "Information requested"
                        : a.status === "draft"
                          ? "Draft application"
                          : a.status}
                </strong>
                <p>
                  {a.status === "waitlisted"
                    ? "No suitable allocation currently offered. No guaranteed queue position or payment due."
                    : "No booth reserved. The organizer acts next."}{" "}
                  Expected decisions: {dateTime(state.event.decisions)}.
                </p>
              </Notice>
            )}
            <h3>Ranked choices stay with this application</h3>
            {data.choices.map((p, i) => (
              <div className="preference-row" key={i}>
                <span>{i + 1}.</span>
                <strong>{p.join(" + ")}</strong>
                <span>
                  {p.every(
                    (id) => boothState(state, id) === "Accepting preferences",
                  )
                    ? "Accepting preferences"
                    : "Currently unavailable"}
                </span>
              </div>
            ))}
            <p className="small">
              Submitted version {a.snapshots.at(-1)?.version ?? "—"}. Reusable
              profile edits do not change this snapshot.
            </p>
            <div className="action-row">
              <ActionLink href="/events/makers-market-2026/apply">
                {a.status === "draft"
                  ? "Continue application"
                  : "Review or correct application"}
              </ActionLink>
              {!offer && a.status !== "draft" && (
                <Button
                  variant="ghost"
                  onClick={() =>
                    dispatch({ type: "withdrawApplication", id: a.id })
                  }
                >
                  Withdraw application
                </Button>
              )}
            </div>
            <CoordinationPanel context={a.id} />
            <History items={a.history} />
            <details>
              <summary>Submitted versions ({a.snapshots.length})</summary>
              {a.snapshots.map((v) => (
                <p key={v.version}>
                  v{v.version} · {dateTime(v.at)} · {v.data.name} ·{" "}
                  {v.data.choices.map((p) => p.join(" + ")).join("; ")}
                </p>
              ))}
            </details>
          </section>
          <div>
            {offer ? (
              <PaymentPanel key={offer.id} agreement={offer} />
            ) : (
              <Notice>
                Selection is the organizer&apos;s decision. Applying and
                shortlisting do not create a reservation.
              </Notice>
            )}
            {offer?.status === "confirmed" && (
              <div className="panel">
                <h3>Prepare for the event</h3>
                <p>
                  Setup begins{" "}
                  {dateTime(offer.contextSnapshot?.setup ?? state.event.setup)}.
                  Keep the walkway clear; bring equipment within your declared
                  limits.
                </p>
                <p>Sample organizer contact: {state.event.contact}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
