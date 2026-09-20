import { describe, it, expect } from "vitest";
import { createScene } from "../../src/demo/scenes";
import { journeyFor } from "../../src/domain/presentation";
import { venueDay } from "../../src/domain/venue-calendar";

describe("presentation guidance", () => {
  it("keeps a confirmed allocation clear during balance receipt review", () => {
    const s=createScene("merchant-proof-review");
    const a=s.agreements.find(a=>a.parentId==="paper-and-clay")!;
    a.status="confirmed"; a.allocation="confirmed";
    expect(journeyFor(s,a.parentId)).toMatchObject({stage:"Balance payment review",step:4});
  });
  it("hands a submitted inquiry to its exact venue without modifying state", () => {
    const s = createScene("venue-inquiry");
    const b = s.bookings.find((b) => b.id === "alex-celebration")!;
    b.submitted = true;
    b.venueId = "sample-pavilion";
    const before = JSON.stringify(s);
    expect(journeyFor(s, b.id)).toMatchObject({
      role: "venue",
      identity: "sample-pavilion",
      href: "/bookings/alex-celebration",
    });
    expect(JSON.stringify(s)).toBe(before);
  });
  it("sends receipt review to the organizer and corrections to the payer", () => {
    const s = createScene("merchant-proof-review");
    expect(journeyFor(s, "paper-and-clay")).toMatchObject({
      role: "organizer",
      identity: "sample-market-team",
    });
    s.receipts
      .filter((r) => r.status === "submitted")
      .forEach((r) => (r.status = "needs-resolution"));
    expect(journeyFor(s, "paper-and-clay")).toMatchObject({
      role: "merchant",
      identity: "paper-and-clay",
    });
  });
  it("does not tell a payer to pay expired or canceled offers", () => {
    const s = createScene("merchant-offer");
    const a = s.agreements.find((a) => a.parentId === "paper-and-clay")!;
    for (const status of [
      "expired",
      "canceled",
      "replaced",
      "declined",
    ] as const) {
      a.status = status;
      a.allocation = "released";
      expect(journeyFor(s, a.parentId)?.detail).not.toMatch(/submit.*payment/i);
      expect(journeyFor(s, a.parentId)?.deadline).toBeUndefined();
    }
  });
  it("keeps the selected merchant in the organizer handoff URL", () => {
    const s = createScene("merchant-review");
    expect(journeyFor(s, "brew-corner")?.href).toContain(
      "application=brew-corner",
    );
  });
  it("routes required packet revisions back to their owner", () => {
    const s = createScene("event-revision");
    expect(journeyFor(s, s.event.id)).toMatchObject({
      role: "organizer",
      identity: "sample-market-team",
    });
  });
});
describe("public calendar", () => {
  it("includes setup and cleanup and uses exclusive end at PHT midnight", () => {
    const s = createScene("venue-quote");
    const a = s.agreements.find((a) => a.parentId === "alex-celebration")!;
    s.agreements = [a];
    a.accessStart = "2026-11-12T23:00:00+08:00";
    a.accessEnd = "2026-11-14T00:00:00+08:00";
    expect(venueDay(s, a.venueId!, "2026-11-12").status).toBe("Held");
    expect(venueDay(s, a.venueId!, "2026-11-13").status).toBe("Held");
    expect(venueDay(s, a.venueId!, "2026-11-14").status).toBe("Available");
    a.allocation = "released";
    expect(venueDay(s, a.venueId!, "2026-11-13").status).toBe("Available");
  });
  it("exposes only anonymous intervals and no payer or booking IDs", () => {
    const s = createScene("venue-quote");
    const a = s.agreements.find((a) => a.parentId === "alex-celebration")!;
    const day = a.accessStart!.slice(0, 10);
    const result = JSON.stringify(venueDay(s, a.venueId!, day));
    expect(result).not.toContain(a.payerId);
    expect(result).not.toContain(a.parentId);
  });
});
