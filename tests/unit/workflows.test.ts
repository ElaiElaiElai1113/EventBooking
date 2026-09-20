import { expect, it } from "vitest";
import { createFixture, at } from "@/demo/fixtures";
import { transition } from "@/domain/transition";
import type { Action } from "@/domain/commands";
import type { DemoState, Role } from "@/domain/model";
export function run(
  s: DemoState,
  a: Action,
  role: Role = "organizer",
  actorId = role === "merchant"
    ? "paper-and-clay"
    : role === "customer"
      ? "alex"
      : role === "venue"
        ? "sample-hall"
        : "sample-market-team",
) {
  return transition(s, {
    ...a,
    role,
    actorId,
    expectedRevision: s.revision,
    commandId: `test-${s.revision}-${a.type}`,
  });
}
export function good(s: DemoState, a: Action, role?: Role, actor?: string) {
  const r = run(s, a, role, actor);
  if (!r.ok) throw new Error(r.issues.map((i) => i.message).join("; "));
  return r.state;
}
export function reviewed() {
  const s = createFixture();
  s.now = at("11-06");
  s.event.status = "published";
  s.event.arrangement.agreedVersion = 1;
  s.event.arrangement.packet.forEach((p) => (p.reviewedVersion = 1));
  s.applications[1].status = "submitted";
  s.applications[1].snapshots = [
    { version: 1, at: s.now, data: structuredClone(s.applications[1].draft) },
  ];
  return s;
}
export function offered(full = false) {
  let s = reviewed();
  s.event.terms.mode = full ? "full" : "deposit";
  s = good(s, {
    type: "sendOffer",
    id: "paper-and-clay",
    booths: ["30", "31"],
  });
  return s;
}
it("blocks premature offers without mutating state", () => {
  const s = reviewed();
  s.now = at("11-05", "17:00");
  const r = run(s, {
    type: "sendOffer",
    id: "paper-and-clay",
    booths: ["30", "31"],
  });
  expect(r.ok).toBe(false);
  expect(r.state).toBe(s);
});
it("enforces roles, physical pairs, exclusive atomic holds and one active offer", () => {
  let s = reviewed();
  expect(
    run(s, { type: "sendOffer", id: "paper-and-clay", booths: ["26", "27"] })
      .ok,
  ).toBe(false);
  expect(
    run(
      s,
      { type: "sendOffer", id: "paper-and-clay", booths: ["30", "31"] },
      "venue",
    ).ok,
  ).toBe(false);
  s = good(s, { type: "sendOffer", id: "brew-corner", booths: ["23"] });
  expect(
    run(s, { type: "sendOffer", id: "paper-and-clay", booths: ["23", "24"] })
      .ok,
  ).toBe(false);
  expect(s.agreements.flatMap((a) => a.boothIds)).not.toContain("24");
  s = good(s, {
    type: "sendOffer",
    id: "paper-and-clay",
    booths: ["30", "31"],
  });
  expect(s.agreements).toHaveLength(2);
  expect(
    run(s, { type: "sendOffer", id: "paper-and-clay", booths: ["27", "28"] })
      .ok,
  ).toBe(false);
  expect(s.applications[5].status).toBe("submitted");
});
it("keeps acceptance deadline and protects timely unverified proof after expiry", () => {
  let s = offered();
  const id = s.agreements[0].id;
  const deadline = s.agreements[0].expiresAt;
  s = good(s, { type: "accept", id }, "merchant");
  expect(s.agreements[0].expiresAt).toBe(deadline);
  s = good(
    s,
    { type: "submitReceipt", id, reference: "DEMO-1", amount: 200000 },
    "merchant",
  );
  s = good(s, { type: "advance", time: at("11-09") });
  expect(s.agreements[0].allocation).toBe("held");
  expect(s.agreements[0].status).not.toBe("confirmed");
  s = good(s, {
    type: "reviewReceipt",
    id: s.receipts[0].id,
    decision: "verify",
    amount: 200000,
    reason: "Sample receipt matched",
  });
  expect(s.agreements[0].allocation).toBe("confirmed");
});
it("full mode requires total; duplicate receipts and verification never double credit", () => {
  let s = offered(true);
  const id = s.agreements[0].id;
  s = good(s, { type: "accept", id }, "merchant");
  s = good(
    s,
    { type: "submitReceipt", id, reference: "DEMO-A", amount: 200000 },
    "merchant",
  );
  s = good(s, {
    type: "reviewReceipt",
    id: s.receipts[0].id,
    decision: "verify",
    amount: 200000,
    reason: "Matched",
  });
  expect(s.agreements[0].status).not.toBe("confirmed");
  expect(
    run(s, {
      type: "reviewReceipt",
      id: s.receipts[0].id,
      decision: "verify",
      amount: 200000,
      reason: "Again",
    }).ok,
  ).toBe(false);
  s = good(
    s,
    { type: "submitReceipt", id, reference: "DEMO-A", amount: 200000 },
    "merchant",
  );
  expect(s.receipts[1].status).toBe("needs-resolution");
  expect(
    run(s, {
      type: "reviewReceipt",
      id: s.receipts[1].id,
      decision: "verify",
      amount: 200000,
      reason: "Duplicate",
    }).ok,
  ).toBe(false);
  s = good(
    s,
    { type: "submitReceipt", id, reference: "DEMO-B", amount: 200000 },
    "merchant",
  );
  s = good(s, {
    type: "reviewReceipt",
    id: s.receipts[2].id,
    decision: "verify",
    amount: 200000,
    reason: "Matched",
  });
  expect(s.agreements[0].status).toBe("confirmed");
});
it("expires unpaid pair, retains application, late proof cannot reclaim replacement", () => {
  let s = offered();
  const id = s.agreements[0].id;
  s = good(s, { type: "accept", id }, "merchant");
  s = good(s, { type: "advance", time: at("11-08") });
  expect(s.agreements[0].allocation).toBe("released");
  s = good(s, { type: "sendOffer", id: "iced-sip", booths: ["30"] });
  s = good(
    s,
    { type: "submitReceipt", id, reference: "LATE", amount: 200000 },
    "merchant",
  );
  expect(
    run(s, {
      type: "reviewReceipt",
      id: s.receipts[0].id,
      decision: "verify",
      amount: 200000,
      reason: "Late",
    }).ok,
  ).toBe(false);
  expect(s.agreements[1].allocation).toBe("held");
  expect(s.applications).toHaveLength(8);
});
it("cancellation request retains pair; decision releases and refund is separate", () => {
  let s = offered();
  const id = s.agreements[0].id;
  s = good(s, { type: "accept", id }, "merchant");
  s = good(
    s,
    { type: "submitReceipt", id, reference: "DEPOSIT", amount: 200000 },
    "merchant",
  );
  s = good(s, {
    type: "reviewReceipt",
    id: s.receipts[0].id,
    decision: "verify",
    amount: 200000,
    reason: "Matched",
  });
  s = good(s, { type: "advance", time: at("11-09") });
  s = good(
    s,
    { type: "requestCancellation", id, reason: "Cannot attend" },
    "merchant",
  );
  expect(s.agreements[0].allocation).toBe("confirmed");
  s = good(s, {
    type: "decideCancellation",
    id,
    confirm: true,
    reason: "Timely sample withdrawal",
    refund: 200000,
  });
  expect(s.agreements[0].allocation).toBe("released");
  expect(s.cancellations[0].refunds).toHaveLength(0);
  expect(
    run(s, { type: "refund", id, reference: "R", amount: 200001 }).ok,
  ).toBe(false);
  s = good(s, { type: "refund", id, reference: "R", amount: 200000 });
  expect(s.cancellations[0].refunds[0].amount).toBe(200000);
  expect(
    run(s, { type: "refund", id, reference: "R", amount: 200000 }).ok,
  ).toBe(false);
});
it("publication needs explicit current reviewed agreement; revision invalidates it", () => {
  let s = createFixture();
  expect(run(s, { type: "publish" }).ok).toBe(false);
  expect(run(s, { type: "agree" }, "venue").ok).toBe(false);
  s = good(s, { type: "reviewAllPacket" }, "venue");
  s = good(s, { type: "agree" }, "venue");
  s = good(s, { type: "publish" });
  expect(s.event.status).toBe("published");
  expect(s.agreements).toHaveLength(0);
  const a = s.event.arrangement;
  s = good(s, {
    type: "saveArrangement",
    rules: "Revised 400W",
    accessStart: a.accessStart,
    accessEnd: a.accessEnd,
    existing: false,
    venueName: a.venueName,
    address: a.address,
    contact: a.contact,
    prerequisite: "none",
  });
  expect(s.event.arrangement.version).toBe(2);
  expect(run(s, { type: "publish" }).ok).toBe(false);
});
it("inquiry has no hold; overlapping quote rejected; accepted quote needs venue verification", () => {
  let s = createFixture();
  s.now = at("10-19", "10:00");
  s = good(s, { type: "submitInquiry", id: "alex-celebration" }, "customer");
  expect(s.agreements).toHaveLength(0);
  const b = s.bookings[0];
  const quote: Action = {
    type: "quote",
    id: b.id,
    total: 2000000,
    initial: 1000000,
    accessStart: b.draft.accessStart,
    accessEnd: b.draft.accessEnd,
    balanceDue: at("11-05"),
    inclusions: "Whole venue",
  };
  s = good(s, quote, "venue");
  expect(s.agreements[0].expiresAt).toBe("2026-10-20T02:00:00.000Z");
  s.bookings.push({ ...structuredClone(b), id: "second", payerId: "second" });
  expect(run(s, { ...quote, id: "second" }, "venue").ok).toBe(false);
  const id = s.agreements[0].id;
  s = good(s, { type: "accept", id }, "customer");
  s = good(
    s,
    { type: "submitReceipt", id, reference: "ALEX", amount: 1000000 },
    "customer",
  );
  expect(s.agreements[0].status).toBe("accepted");
  expect(
    run(
      s,
      {
        type: "reviewReceipt",
        id: s.receipts[0].id,
        decision: "verify",
        amount: 1000000,
        reason: "Matched",
      },
      "organizer",
    ).ok,
  ).toBe(false);
  s = good(
    s,
    {
      type: "reviewReceipt",
      id: s.receipts[0].id,
      decision: "verify",
      amount: 1000000,
      reason: "Matched",
    },
    "venue",
  );
  expect(s.agreements[0].status).toBe("confirmed");
});
it("submission is one record and immutable snapshot; rejects invalid choice preserving draft", () => {
  let s = reviewed();
  s.now = at("11-01");
  s.applications[1].status = "draft";
  s.applications[1].snapshots = [];
  s = good(s, { type: "submitApplication", id: "paper-and-clay" }, "merchant");
  expect(s.applications.filter((a) => a.status === "submitted")).toHaveLength(
    8,
  );
  s = good(
    s,
    { type: "saveProfile", id: "paper-and-clay", name: "New profile" },
    "merchant",
  );
  expect(s.applications[1].snapshots[0].data.name).toBe("Paper and Clay");
  const draft = { ...s.applications[1].draft, choices: [["26", "27"]] };
  s = good(
    s,
    { type: "saveApplication", id: "paper-and-clay", draft },
    "merchant",
  );
  expect(
    run(s, { type: "submitApplication", id: "paper-and-clay" }, "merchant").ok,
  ).toBe(false);
  expect(s.applications[1].draft.choices).toEqual([["26", "27"]]);
});
it("meetings require recipient action and never imply agreement", () => {
  let s = createFixture();
  s.now = at("10-19", "09:00");
  s = good(s, {
    type: "meeting",
    agenda: "Review power",
    time: at("10-21", "10:00"),
    duration: 30,
    kind: "online",
    details: "Sample call, no real link",
  });
  expect(
    run(s, {
      type: "respondMeeting",
      id: s.event.meetings[0].id,
      decision: "accept",
    }).ok,
  ).toBe(false);
  s = good(
    s,
    { type: "respondMeeting", id: s.event.meetings[0].id, decision: "accept" },
    "venue",
  );
  expect(s.event.meetings[0].state).toBe("accepted");
  expect(s.event.arrangement.agreedVersion).toBeNull();
});
