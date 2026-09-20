import { expect, it } from "vitest";
import { createScene, identityFor, scenes } from "@/demo/scenes";
import { transition } from "@/domain/transition";
import { publicationIssues } from "@/domain/publication";
import type { Action } from "@/domain/commands";
import type { DemoState, Role } from "@/domain/model";
import { at } from "@/demo/fixtures";
import { latestAgreement, balance, paid } from "@/domain/selectors";
const run = (
  s: DemoState,
  a: Action,
  role: Role = "organizer",
  actorId = identityFor(role),
) =>
  transition(s, {
    ...a,
    role,
    actorId,
    expectedRevision: s.revision,
    commandId: `extended-${s.revision}-${a.type}`,
  });
const apply = (s: DemoState, a: Action, role?: Role) => {
  const r = run(s, a, role);
  if (!r.ok) throw new Error(r.issues.map((i) => i.message).join(";"));
  return r.state;
};
it.each(scenes)("scene %s does not contain future submissions", (id) => {
  const s = createScene(id);
  expect(
    s.applications.every((a) =>
      a.snapshots.every((v) => Date.parse(v.at) <= Date.parse(s.now)),
    ),
  ).toBe(true);
});
it("accepted offer preserves event schedule, operating rules and booth dimensions", () => {
  let s = createScene("merchant-offer");
  const id = latestAgreement(s, "paper-and-clay")!.id;
  s = apply(s, { type: "accept", id }, "merchant");
  const before = structuredClone(latestAgreement(s, "paper-and-clay"));
  s = apply(s, { type: "saveEvent", patch: { start: at("11-14", "11:00") } });
  const a = latestAgreement(s, "paper-and-clay")!;
  expect(a).toEqual(before);
  expect(a.contextSnapshot?.start).toBe(at("11-14", "10:00"));
  expect(a.contextSnapshot?.booths[0].width).toBe(2);
});
it("acceptance cannot occur at the exact expiry boundary", () => {
  const s = createScene("merchant-offer");
  s.now = at("11-08");
  expect(
    run(
      s,
      { type: "accept", id: latestAgreement(s, "paper-and-clay")!.id },
      "merchant",
    ).ok,
  ).toBe(false);
});
it("extensions cannot shorten deadlines or run past balance/readiness", () => {
  const s = createScene("merchant-offer"),
    id = latestAgreement(s, "paper-and-clay")!.id;
  expect(
    run(s, {
      type: "extend",
      id,
      until: at("11-08", "17:00"),
      reason: "Too short",
    }).ok,
  ).toBe(false);
  expect(
    run(s, { type: "extend", id, until: at("11-12"), reason: "Too late" }).ok,
  ).toBe(false);
});
it("late initial offers cannot silently shorten the full 48-hour window", () => {
  const s = createScene("merchant-review");
  s.now = at("11-11");
  expect(
    run(s, { type: "sendOffer", id: "paper-and-clay", booths: ["30", "31"] })
      .ok,
  ).toBe(false);
});
it("wrong payer, negative receipt, unclear proof and unpaid decline cannot confirm or release paid holds", () => {
  let s = createScene("merchant-proof-review");
  const a = latestAgreement(s, "paper-and-clay")!;
  expect(
    run(
      s,
      { type: "submitReceipt", id: a.id, reference: "WRONG", amount: 200000 },
      "merchant",
      "brew-corner",
    ).ok,
  ).toBe(false);
  expect(
    run(
      s,
      { type: "submitReceipt", id: a.id, reference: "NEGATIVE", amount: -1 },
      "merchant",
    ).ok,
  ).toBe(false);
  expect(run(s, { type: "decline", id: a.id }, "merchant").ok).toBe(false);
  const r = s.receipts.find((r) => r.agreementId === a.id)!;
  s = apply(s, {
    type: "reviewReceipt",
    id: r.id,
    decision: "resolve",
    amount: 0,
    reason: "Unclear sample reference",
  });
  s = apply(s, { type: "advance", time: at("11-10") });
  expect(latestAgreement(s, "paper-and-clay")!.allocation).toBe("held");
  expect(paid(s, a.id)).toBe(0);
});
it("failed replacement retains the original atomic hold", () => {
  const s = createScene("merchant-offer");
  const result = run(s, {
    type: "sendOffer",
    id: "paper-and-clay",
    booths: ["23", "24"],
    replace: true,
  });
  expect(result.ok).toBe(false);
  expect(result.state).toBe(s);
  expect(latestAgreement(result.state, "paper-and-clay")!.boothIds).toEqual([
    "30",
    "31",
  ]);
});
it("price and policy edits do not reset unrelated venue agreement or rewrite existing offer", () => {
  let s = createScene("merchant-offer");
  const before = structuredClone(latestAgreement(s, "paper-and-clay"));
  const version = s.event.arrangement.version;
  s = apply(s, {
    type: "editBooth",
    booth: { ...s.event.booths.find((b) => b.id === "30")!, price: 350000 },
  });
  s = apply(s, {
    type: "saveTerms",
    terms: { ...s.event.terms, withdrawal: "New illustrative policy" },
  });
  expect(s.event.arrangement.version).toBe(version);
  expect(latestAgreement(s, "paper-and-clay")).toEqual(before);
});
it("full-payment publication ignores inactive deposit values but deposit mode does not", () => {
  const s = createScene("merchant-review");
  s.event.terms.mode = "full";
  s.event.terms.percent = 0;
  s.event.terms.balanceDue = "";
  expect(publicationIssues(s)).toEqual([]);
  s.event.terms.mode = "deposit";
  expect(publicationIssues(s).length).toBeGreaterThan(0);
});
it("venue cancellation and partial refund leave merchant and other rental accounting unchanged", () => {
  let s = createScene("venue-quote");
  const a = latestAgreement(s, "alex-celebration")!;
  s = apply(s, { type: "accept", id: a.id }, "customer");
  s = apply(
    s,
    { type: "submitReceipt", id: a.id, reference: "ALEX", amount: 1000000 },
    "customer",
  );
  s = apply(
    s,
    {
      type: "reviewReceipt",
      id: s.receipts.at(-1)!.id,
      decision: "verify",
      amount: 1000000,
      reason: "Matched",
    },
    "venue",
  );
  const rental = structuredClone(latestAgreement(s, "organizer-rental"));
  s = apply(
    s,
    { type: "requestCancellation", id: a.id, reason: "Early withdrawal" },
    "customer",
  );
  s = apply(
    s,
    {
      type: "decideCancellation",
      id: a.id,
      confirm: true,
      refund: 1000000,
      reason: "Sample early withdrawal",
    },
    "venue",
  );
  s = apply(
    s,
    { type: "refund", id: a.id, reference: "PART", amount: 500000 },
    "venue",
  );
  expect(s.cancellations[0].refunds[0].amount).toBe(500000);
  expect(balance(s, latestAgreement(s, "alex-celebration")!)).toBe(0);
  expect(latestAgreement(s, "organizer-rental")).toEqual(rental);
});
