"use client";
import { useState, useId } from "react";
import { useDemo } from "@/demo/demo-provider";
import { venueDay } from "@/domain/venue-calendar";
import { dateTime, localInput } from "@/domain/time";
import { Button } from "@/components/ui/button";

export function VenueCalendar({ venueId }: { venueId: string }) {
  const { state } = useDemo();
  const heading = useId();
  const [month, setMonth] = useState(() => localInput(state.now).slice(0, 7));
  const [selected, setSelected] = useState(() =>
    localInput(state.now).slice(0, 10),
  );
  const first = new Date(`${month}-01T00:00:00Z`);
  const count = new Date(
    Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0),
  ).getUTCDate();
  const label = first.toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const day = venueDay(state, venueId, selected);
  const move = (delta: number) => {
    const date = new Date(
      Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + delta, 1),
    )
      .toISOString()
      .slice(0, 10);
    setMonth(date.slice(0, 7));
    setSelected(date);
  };
  return (
    <section className="venue-calendar" aria-labelledby={heading}>
      <div className="spread">
        <div>
          <p className="eyebrow">PLAN YOUR DATES</p>
          <h2 id={heading}>Sample availability</h2>
        </div>
        <span className="small muted">Philippine time</span>
      </div>
      <p>
        Available means no recorded hold in this demo. The venue must still
        check your exact hours, setup and cleanup before issuing a quote.
      </p>
      <div className="calendar-heading">
        <Button
          variant="ghost"
          aria-label="Previous month"
          onClick={() => move(-1)}
        >
          ←
        </Button>
        <h3 aria-live="polite">{label}</h3>
        <Button variant="ghost" aria-label="Next month" onClick={() => move(1)}>
          →
        </Button>
      </div>
      <div className="month-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <span className="weekday" key={d}>
            {d}
          </span>
        ))}
        {Array.from({ length: first.getUTCDay() }, (_, i) => (
          <span key={`blank-${i}`} aria-hidden="true" />
        ))}
        {Array.from({ length: count }, (_, i) => {
          const date = `${month}-${String(i + 1).padStart(2, "0")}`;
          const status = venueDay(state, venueId, date).status;
          return (
            <button
              key={date}
              className={`calendar-day ${status.toLowerCase()}`}
              aria-label={`${date} · ${status}`}
              aria-pressed={selected === date}
              onClick={() => setSelected(date)}
            >
              <span>{i + 1}</span>
              <span className="calendar-dot" aria-hidden="true" />
            </button>
          );
        })}
      </div>
      <div className="calendar-legend">
        {["Available", "Held", "Confirmed"].map((s) => (
          <span className={s.toLowerCase()} key={s}>
            <i className="calendar-dot" />
            {s}
          </span>
        ))}
      </div>
      <div className="selected-day" aria-live="polite">
        <strong>
          {new Date(`${selected}T00:00:00+08:00`).toLocaleDateString("en-PH", {
            month: "long",
            day: "numeric",
            year: "numeric",
            timeZone: "Asia/Manila",
          })}{" "}
          · {day.status}
        </strong>
        {day.intervals.length ? (
          day.intervals.map((interval, i) => (
            <p className="small" key={i}>
              {interval.status} access: {dateTime(interval.start)} —{" "}
              {dateTime(interval.end)}. Includes setup and cleanup.
            </p>
          ))
        ) : (
          <p className="small">
            No recorded hold. Request your preferred date in the inquiry;
            selecting it here makes no reservation.
          </p>
        )}
      </div>
    </section>
  );
}
