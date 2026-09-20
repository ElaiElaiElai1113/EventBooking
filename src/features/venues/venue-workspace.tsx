"use client";
import { useState } from "react";
import { useDemo } from "@/demo/demo-provider";
import { RoleGate, PageHeading, Status } from "@/components/shared/common";
import { BookingDetail } from "./booking-detail";
import { VenueCalendar } from "./venue-calendar";
import { agreementStatus, latestAgreement } from "@/domain/selectors";
import { dateTime } from "@/domain/time";
export function VenueWorkspace() {
  const { state } = useDemo();
  const [view, setView] = useState("requests"),
    [selected, setSelected] = useState("alex-celebration");
  const bookings = state.bookings.filter(
    (b) => b.venueId === state.identity && b.submitted,
  );
  return (
    <RoleGate roles={["venue"]}>
      <div className="container">
        <PageHeading
          eyebrow="VENUE WORKSPACE"
          title="Every gathering starts here."
          description="Requests, full-access holds and confirmed rentals share one calendar."
        />
        <div className="tabs" role="tablist" aria-label="Venue workspace view">
          <button
            role="tab"
            aria-selected={view === "requests"}
            onClick={() => setView("requests")}
          >
            Requests
          </button>
          <button
            role="tab"
            aria-selected={view === "calendar"}
            onClick={() => setView("calendar")}
          >
            Calendar
          </button>
        </div>
        {view === "calendar" && (
          <section className="panel">
            <h2>Whole-venue calendar</h2>
            <VenueCalendar key={state.identity} venueId={state.identity} />
            <p className="small">
              An accessible interval list; no external calendar sync.
            </p>
            {state.agreements
              .filter(
                (a) =>
                  a.kind === "venue" &&
                  a.venueId === state.identity &&
                  a.allocation !== "released",
              )
              .map((a) => (
                <button
                  className="calendar-row"
                  key={a.id}
                  onClick={() => {
                    setSelected(a.parentId);
                    setView("requests");
                  }}
                >
                  <strong>{a.payerName}</strong>
                  <span>
                    {dateTime(a.accessStart!)} — {dateTime(a.accessEnd!)}
                  </span>
                  <Status>{a.allocation}</Status>
                </button>
              ))}
          </section>
        )}
        {view === "requests" && (
          <div className="review-grid">
            <aside className="applicant-list">
              {bookings.map((b) => (
                <button
                  className={selected === b.id ? "selected" : ""}
                  key={b.id}
                  onClick={() => setSelected(b.id)}
                >
                  <span>
                    <strong>{b.draft.name}</strong>
                    <small>{b.draft.purpose}</small>
                    <small>
                      {latestAgreement(state, b.id)
                        ? agreementStatus(state, latestAgreement(state, b.id))
                        : "Inquiry · no hold"}
                    </small>
                  </span>
                </button>
              ))}
              {!bookings.length && <p>No submitted requests yet.</p>}
            </aside>
            {bookings.some((b) => b.id === selected) ? (
              <BookingDetail key={selected} id={selected} embedded />
            ) : (
              <p>Select a request to review.</p>
            )}
          </div>
        )}
      </div>
    </RoleGate>
  );
}
