"use client";
import { useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { useDemo } from "@/demo/demo-provider";
import {
  ActionLink,
  Notice,
  TermsView,
  Status,
} from "@/components/shared/common";
import { dateTime, applicationWindow } from "@/domain/time";
import { BoothMap } from "@/features/booths/booth-choice";
import { money } from "@/domain/money";
export function EventPublic({ preview = false }: { preview?: boolean }) {
  const { state } = useDemo();
  const e = state.event;
  const [selected, setSelected] = useState<string[]>([]);
  const window = applicationWindow(state.now, e.opens, e.closes);
  if (e.status !== "published" && !preview)
    return (
      <div className="container">
        <h1>Event not published yet</h1>
        <Notice>
          The organizer is preparing the venue arrangement and application
          details. No applications are open.
        </Notice>
      </div>
    );
  const a = state.applications.find((a) => a.businessId === state.identity);
  const b = e.booths.find((b) => b.id === selected[0]);
  return (
    <div className={preview ? "" : "container"}>
      <div className="event-cover">
        <p className="eyebrow">A WEEKEND FOR MAKERS · FICTIONAL EVENT</p>
        {preview ? <h2>{e.name}</h2> : <h1 tabIndex={-1}>{e.name}</h1>}
        <p>{e.description}</p>
        <div className="inline-facts">
          <span>
            <CalendarDays size={18} />
            {dateTime(e.start)} — {dateTime(e.end)}
          </span>
          <span>
            <MapPin size={18} />
            {e.arrangement.venueName}, Davao City
          </span>
        </div>
        <Status>Applications {window}</Status>
      </div>
      <div className="two-columns">
        <section>
          <h2>A space for what you make.</h2>
          <p>{e.categories}</p>
          <p>{e.selection}</p>
          <BoothMap selected={selected} onSelect={(id) => setSelected([id])} />
          {b && (
            <Notice>
              <strong>
                Booth {b.id} · {money(b.price)}
              </strong>
              <p>
                {b.width} × {b.depth}m · Row {b.row}. {b.inclusions}.{" "}
                {b.power ? `Power up to ${b.watts}W` : "No power connection"}.{" "}
                {b.restrictions}.
              </p>
              <p>
                Eligible neighboring pairs:{" "}
                {e.pairs
                  .filter((p) => p.includes(b.id))
                  .map((p) => p.join(" + "))
                  .join(", ") || "None"}
                .
              </p>
            </Notice>
          )}
          <TermsView terms={e.terms} />
        </section>
        <aside className="panel">
          <p className="eyebrow">YOUR NEXT MARKET</p>
          <h2>
            Apply once.
            <br />
            Keep your options open.
          </h2>
          <p className="small">
            Choose one booth or an eligible adjacent pair. Add up to three
            ranked preferences in the same application.
          </p>
          <div className="money-rows">
            <div>
              <span>Per booth, full edition · from</span>
              <strong>
                {money(
                  Math.min(
                    ...e.booths
                      .filter((b) => !b.unavailable)
                      .map((b) => b.price),
                  ),
                )}
              </strong>
            </div>
            <div>
              <span>Applications open</span>
              <span>{dateTime(e.opens)}</span>
            </div>
            <div>
              <span>Apply by</span>
              <span>{dateTime(e.closes)}</span>
            </div>
            <div>
              <span>Expected decisions</span>
              <span>{dateTime(e.decisions)}</span>
            </div>
          </div>
          <p className="small">
            {e.terms.mode === "deposit"
              ? `${e.terms.percent}% deposit after accepting an exact offer.`
              : "Full payment after accepting an exact offer."}{" "}
            No booth payment when applying.
          </p>
          {!preview &&
            (a?.status !== "draft" && a ? (
              <ActionLink href={`/applications/${a.id}`}>
                View your application
              </ActionLink>
            ) : window === "open" ? (
              <ActionLink href={`/events/${e.id}/apply`}>
                Apply for a booth
              </ActionLink>
            ) : (
              <Notice>
                {window === "upcoming"
                  ? `Applications open ${dateTime(e.opens)}.`
                  : "New applications are closed. Existing applicants can still access their record."}
              </Notice>
            ))}
          <p className="small muted" style={{ marginTop: 24 }}>
            Organizer: {e.organizer}
            <br />
            Sample contact: {e.contact}
            <br />
            Setup: {dateTime(e.setup)}
            <br />
            Cleanup ends: {dateTime(e.cleanup)}
          </p>
        </aside>
      </div>
    </div>
  );
}
