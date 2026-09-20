"use client";
import { useState } from "react";
import { useDemo } from "@/demo/demo-provider";
import { PageHeading, RoleGate } from "@/components/shared/common";
import { ReviewPacket } from "./review-packet";
import { CoordinationPanel } from "./coordination-panel";
import { BoothMap } from "@/features/booths/booth-choice";
import { dateTime } from "@/domain/time";
export function VenueReview() {
  const { state } = useDemo();
  const [selected, setSelected] = useState<string[]>([]);
  const a = state.event.arrangement;
  return (
    <RoleGate roles={["venue"]} identity="sample-hall">
      <div className="container">
        <PageHeading
          eyebrow="SAMPLE HALL · VENUE REVIEW"
          title="Agree the space. Shape the event."
          description="Review the current event use, layout and rules. Merchant selection belongs to the organizer."
        />
        <div className="two-columns">
          <section className="panel">
            <h2>{state.event.name}</h2>
            <p>{state.event.description}</p>
            <p>
              Access: {dateTime(a.accessStart)} — {dateTime(a.accessEnd)}
            </p>
            <p>{a.rules}</p>
            <BoothMap
              selected={selected}
              onSelect={(id) => setSelected([id])}
            />
            <p className="small">
              Eligible pairs:{" "}
              {state.event.pairs.map((p) => p.join(" + ")).join(", ")}
            </p>
            <CoordinationPanel />
          </section>
          <section className="panel">
            <ReviewPacket />
          </section>
        </div>
      </div>
    </RoleGate>
  );
}
