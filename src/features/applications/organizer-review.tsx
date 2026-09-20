"use client";
import { useState } from "react";
import { ReviewActions } from "./review-actions";
import { useDemo } from "@/demo/demo-provider";
import {
  PageHeading,
  RoleGate,
  Status,
  ActionLink,
  History,
} from "@/components/shared/common";
import { BoothMap } from "@/features/booths/booth-choice";
import { boothState } from "@/domain/selectors";
import { dateTime, applicationWindow } from "@/domain/time";
import { Button } from "@/components/ui/button";
export function OrganizerReview({
  initialApplication,
}: {
  initialApplication?: string;
}) {
  const { state } = useDemo();
  const [selected, setSelected] = useState(
      initialApplication ?? "paper-and-clay",
    ),
    [category, setCategory] = useState(""),
    [quantity, setQuantity] = useState(""),
    [status, setStatus] = useState(""),
    [power, setPower] = useState(false),
    [booth, setBooth] = useState("");
  const applications = state.applications.map((a) => ({
    ...a,
    draft: a.snapshots.at(-1)?.data ?? a.draft,
  }));
  const entries = applications.filter(
    (a) =>
      a.status !== "draft" &&
      (!category || a.draft.category === category) &&
      (!quantity || a.draft.quantity === Number(quantity)) &&
      (!status || a.status === status) &&
      (!power || a.draft.power) &&
      (!booth || a.draft.choices.some((p) => p.includes(booth))),
  );
  const a = entries.find((a) => a.id === selected) ?? entries[0];
  return (
    <RoleGate roles={["organizer"]}>
      <div className="container workspace">
        <PageHeading
          eyebrow="SAMPLE DAVAO MAKERS MARKET"
          title="Make room for the right mix."
          description={`Applications ${applicationWindow(state.now, state.event.opens, state.event.closes)} · Closing ${dateTime(state.event.closes)}`}
          action={
            <ActionLink href="/organizer/events/makers-market-2026/roster">
              View roster
            </ActionLink>
          }
        />
        <div className="review-toolbar">
          <strong>{entries.length} applications</strong>
          <label>
            Category
            <select
              aria-label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {[...new Set(state.profiles.map((p) => p.category))].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Space
            <select
              aria-label="Space"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            >
              <option value="">Any quantity</option>
              <option value="1">One booth</option>
              <option value="2">Adjacent pair</option>
            </select>
          </label>
          <label>
            Status
            <select
              aria-label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="submitted">Submitted</option>
              <option value="waitlisted">Waitlisted</option>
              <option value="clarification">Clarification</option>
              <option value="declined">Declined</option>
            </select>
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={power}
              onChange={(e) => setPower(e.target.checked)}
            />
            Needs power
          </label>
          {booth && (
            <Button variant="ghost" onClick={() => setBooth("")}>
              Clear booth {booth} filter
            </Button>
          )}
        </div>
        <div className="review-grid">
          <aside className="applicant-list" aria-label="Applicants">
            {entries.map((x) => (
              <button
                key={x.id}
                className={selected === x.id ? "selected" : ""}
                onClick={() => setSelected(x.id)}
              >
                <span className="avatar">
                  {x.draft.name
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <span>
                  <strong>{x.draft.name}</strong>
                  <small>
                    {x.draft.category} ·{" "}
                    {x.draft.quantity === 2 ? "Adjacent pair" : "One booth"}
                  </small>
                </span>
                <span className="tiny-status">{x.status}</span>
              </button>
            ))}
            {!entries.length && (
              <p className="empty">No applications match these filters.</p>
            )}
          </aside>
          {a ? (
            <section className="application-panel">
              <div className="spread">
                <div>
                  <p className="eyebrow">APPLICATION · {a.id}</p>
                  <h2>{a.draft.name}</h2>
                  <p className="muted">
                    {a.draft.category} ·{" "}
                    {a.draft.quantity === 2
                      ? "Two adjacent booths"
                      : "One booth"}
                  </p>
                </div>
                <Status>{a.status}</Status>
              </div>
              <div className="app-facts">
                <h3>What they bring</h3>
                <p>{a.draft.products}</p>
                <h3>Operating needs</h3>
                <p>{a.draft.needs}</p>
              </div>
              <h3>Ranked booth preferences</h3>
              {a.draft.choices.map((p, i) => (
                <div className="preference-row" key={i}>
                  <span className="rank-number">{i + 1}</span>
                  <strong>{p.join(" + ")}</strong>
                  <span>
                    {p.every(
                      (id) => boothState(state, id) === "Accepting preferences",
                    )
                      ? "Available for an offer"
                      : "Unavailable"}
                  </span>
                </div>
              ))}
              <ReviewActions key={a.id} application={a} />
              <History items={a.history} />
              <details>
                <summary>Inventory & competing preferences</summary>
                <BoothMap selected={booth ? [booth] : []} onSelect={setBooth} />
              </details>
            </section>
          ) : (
            <section className="panel">
              <h2>No matching submitted application</h2>
              <p>
                Adjust the filters or wait for merchants to submit. Unsubmitted
                drafts are private.
              </p>
            </section>
          )}
        </div>
      </div>
    </RoleGate>
  );
}
