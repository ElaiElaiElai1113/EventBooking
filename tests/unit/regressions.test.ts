import { expect, it } from "vitest";
import { createScene, identityFor } from "@/demo/scenes";
import { transition } from "@/domain/transition";
import type { Action } from "@/domain/commands";
import type { DemoState, Role } from "@/domain/model";
import { at } from "@/demo/fixtures";
const run = (s: DemoState, a: Action, role: Role = "organizer") =>
  transition(s, {
    ...a,
    role,
    actorId: identityFor(role),
    expectedRevision: s.revision,
    commandId: `regression-${s.revision}-${a.type}`,
  });
it("material revision pauses publication and blocks new submissions until re-agreed", () => {
  const s = createScene("merchant-entry");
  const r = run(s, {
    type: "saveEvent",
    patch: { start: at("11-14", "11:00") },
  });
  expect(r.ok).toBe(true);
  expect(r.state.event.status).toBe("draft");
  expect(
    run(
      r.state,
      { type: "submitApplication", id: "paper-and-clay" },
      "merchant",
    ).ok,
  ).toBe(false);
});
it("venue quote cannot silently omit requested setup or cleanup", () => {
  const s = createScene("venue-conflict");
  const b = s.bookings.find((b) => b.id === "second-inquiry")!;
  const r = run(
    s,
    {
      type: "quote",
      id: b.id,
      total: 2000000,
      initial: 1000000,
      accessStart: b.draft.start,
      accessEnd: b.draft.end,
      balanceDue: at("11-05"),
      inclusions: "Event only",
    },
    "venue",
  );
  expect(r.ok).toBe(false);
  if (!r.ok) expect(r.issues[0].code).toBe("DATES");
});
it("a canceled rental cannot satisfy the publication deposit prerequisite", () => {
  let s = createScene("event-setup");
  const rental = s.agreements[0];
  rental.status = "canceled";
  rental.allocation = "released";
  s.event.arrangement.prerequisite = "deposit";
  for (const action of [
    { type: "reviewAllPacket" },
    { type: "agree" },
  ] as Action[]) {
    const r = run(s, action, "venue");
    expect(r.ok).toBe(true);
    s = r.state;
  }
  expect(run(s, { type: "publish" }).ok).toBe(false);
});
it("stale commands preserve the prior state and repeated command ids are idempotent", () => {
  const s = createScene("merchant-review");
  const c = {
    type: "sendOffer" as const,
    id: "paper-and-clay",
    booths: ["30", "31"],
    role: "organizer" as const,
    actorId: "sample-market-team",
    expectedRevision: s.revision,
    commandId: "repeat",
  };
  const r = transition(s, c);
  expect(r.ok).toBe(true);
  expect(transition(r.state, c).state).toBe(r.state);
  expect(transition(r.state, { ...c, commandId: "stale" }).ok).toBe(false);
});

it("a revised quote can move the event while preserving setup and cleanup durations", () => {
  const s = createScene("venue-quote");
  const old = structuredClone(s.agreements.at(-1)!);
  const r = run(
    s,
    {
      type: "quote",
      id: "alex-celebration",
      eventStart: at("11-08", "10:00"),
      eventEnd: at("11-08", "18:00"),
      accessStart: at("11-08", "09:00"),
      accessEnd: at("11-08", "19:00"),
      total: 2200000,
      initial: 1100000,
      balanceDue: at("11-05"),
      inclusions: "Revised package",
    },
    "venue",
  );
  expect(r.ok).toBe(true);
  expect(r.state.agreements.at(-1)?.version).toBe(2);
  expect(r.state.agreements.at(-1)?.acceptedAt).toBeUndefined();
  expect(r.state.agreements.find((a) => a.id === old.id)).toMatchObject({
    total: old.total,
    accessStart: old.accessStart,
    allocation: "released",
    status: "replaced",
  });
  expect(
    run(
      s,
      {
        type: "quote",
        id: "alex-celebration",
        eventStart: at("11-08", "10:00"),
        eventEnd: at("11-08", "18:00"),
        accessStart: at("11-08", "10:00"),
        accessEnd: at("11-08", "19:00"),
        total: 2200000,
        initial: 1100000,
        balanceDue: at("11-05"),
        inclusions: "Missing setup",
      },
      "venue",
    ).ok,
  ).toBe(false);
});
