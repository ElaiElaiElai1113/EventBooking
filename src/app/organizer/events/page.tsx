"use client";
import { useDemo } from "@/demo/demo-provider";
import {
  PageHeading,
  RoleGate,
  ActionLink,
  Status,
} from "@/components/shared/common";
import { dateTime } from "@/domain/time";
export default function Page() {
  const { state } = useDemo();
  return (
    <RoleGate roles={["organizer"]}>
      <div className="container">
        <PageHeading
          title="Your events"
          description="Continue preparing your sample market."
        />
        <section className="panel">
          <Status>{state.event.status}</Status>
          <h2 style={{ marginTop: 20 }}>{state.event.name}</h2>
          <p>
            {dateTime(state.event.start)} — {dateTime(state.event.end)} ·{" "}
            {state.event.arrangement.venueName}
          </p>
          <ActionLink href="/organizer/events/makers-market-2026/setup">
            Continue event setup
          </ActionLink>
        </section>
      </div>
    </RoleGate>
  );
}
