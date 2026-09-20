import type { DemoState } from "./model";
import { stamp } from "./time";

export function venueDay(s: DemoState, venueId: string, date: string) {
  const start = stamp(`${date}T00:00:00+08:00`);
  const end = start + 86400000;
  // Allocation is authoritative, including timely proof protected after expiry.
  const intervals = s.agreements
    .filter(
      (a) =>
        a.kind === "venue" &&
        a.venueId === venueId &&
        a.allocation !== "released" &&
        stamp(a.accessStart!) < end &&
        stamp(a.accessEnd!) > start,
    )
    .map((a) => ({
      start: a.accessStart!,
      end: a.accessEnd!,
      status: a.allocation === "confirmed" ? "Confirmed" : "Held",
    }));
  return {
    status: intervals.some((i) => i.status === "Confirmed")
      ? "Confirmed"
      : intervals.length
        ? "Held"
        : "Available",
    intervals,
  };
}
