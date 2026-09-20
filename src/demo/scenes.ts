import { createFixture, at } from "./fixtures";
import { transition } from "@/domain/transition";
import type { Action } from "@/domain/commands";
import type { DemoState, Role } from "@/domain/model";
export const scenes = [
  ["venue-inquiry", "A · Find and inquire", "customer", "/venues/sample-hall"],
  [
    "venue-quote",
    "A · Review venue quote",
    "customer",
    "/bookings/alex-celebration",
  ],
  [
    "venue-conflict",
    "B · Conflicting venue request",
    "venue",
    "/venue/requests",
  ],
  [
    "event-setup",
    "C/D · Prepare event",
    "organizer",
    "/organizer/events/makers-market-2026/setup",
  ],
  [
    "event-revision",
    "C/D · Revised arrangement",
    "venue",
    "/venue/events/makers-market-2026/review",
  ],
  [
    "merchant-entry",
    "E/F · Apply as a merchant",
    "merchant",
    "/events/makers-market-2026",
  ],
  [
    "merchant-review",
    "E · Review eight applications",
    "organizer",
    "/organizer/events/makers-market-2026/applications",
  ],
  [
    "merchant-before-close",
    "F · Before applications close",
    "organizer",
    "/organizer/events/makers-market-2026/applications",
  ],
  [
    "merchant-offer",
    "E/G · Backup pair offered",
    "merchant",
    "/applications/paper-and-clay",
  ],
  [
    "merchant-proof-review",
    "G/H · Timely proof under review",
    "merchant",
    "/applications/paper-and-clay",
  ],
  [
    "merchant-full-payment",
    "H · Full-payment offer",
    "merchant",
    "/applications/paper-and-clay",
  ],
  [
    "merchant-waitlist",
    "I · No suitable pair",
    "organizer",
    "/organizer/events/makers-market-2026/applications",
  ],
  [
    "merchant-cancellation",
    "J · Cancellation and refund",
    "organizer",
    "/organizer/events/makers-market-2026/applications",
  ],
] as const;
export type SceneId = (typeof scenes)[number][0];
export const identityFor = (role: Role) =>
  role === "merchant"
    ? "paper-and-clay"
    : role === "organizer"
      ? "sample-market-team"
      : role === "venue"
        ? "sample-hall"
        : "alex";
export function createScene(scene: string): DemoState {
  const meta = scenes.find((x) => x[0] === scene);
  if (!meta) throw new Error("Unknown demo scene.");
  let s = createFixture();
  s.now = at("10-19", "09:00");
  s.applications.forEach((a) => {
    a.status = "draft";
    a.snapshots = [];
    a.history = [];
  });
  const act = (
    a: Action,
    role: Role = "organizer",
    actorId = identityFor(role),
  ) => {
    const r = transition(s, {
      ...a,
      role,
      actorId,
      expectedRevision: s.revision,
      commandId: `scene-${scene}-${s.revision}-${a.type}`,
    });
    if (!r.ok) throw new Error(r.issues.map((i) => i.message).join(" "));
    s = r.state;
  };
  const quote = (id: string) => {
    const b = s.bookings.find((b) => b.id === id)!;
    act(
      {
        type: "quote",
        id,
        total: 2000000,
        initial: 1000000,
        accessStart: b.draft.accessStart,
        accessEnd: b.draft.accessEnd,
        balanceDue: id === "organizer-rental" ? at("11-11") : at("11-05"),
        inclusions: "Whole venue, tables and chairs",
      },
      "venue",
    );
  };
  // Every preset has a separate organizer rental and an auditable receiving-party receipt.
  quote("organizer-rental");
  const rental = s.agreements.at(-1)!.id;
  act({ type: "accept", id: rental });
  act({
    type: "submitReceipt",
    id: rental,
    reference: "DEMO-RENTAL",
    amount: 1000000,
  });
  act(
    {
      type: "reviewReceipt",
      id: s.receipts.at(-1)!.id,
      decision: "verify",
      amount: 1000000,
      reason: "Sample venue receipt matched",
    },
    "venue",
  );
  if (scene.startsWith("venue-") && scene !== "venue-inquiry") {
    act({ type: "submitInquiry", id: "alex-celebration" }, "customer");
    act({ type: "advance", time: at("10-19", "10:00") });
    quote("alex-celebration");
    act({ type: "advance", time: at("10-19", "10:30") });
    if (scene === "venue-conflict") {
      const second = structuredClone(s.bookings[0]);
      second.id = "second-inquiry";
      second.payerId = "sample-second";
      second.draft.name = "Sample second customer";
      second.history = ["Second overlapping inquiry received; no hold."];
      s.bookings.push(second);
    }
  }
  if (scene === "event-revision") {
    act({ type: "reviewAllPacket" }, "venue");
    act({ type: "agree" }, "venue");
    act({
      type: "saveArrangement",
      ...s.event.arrangement,
      rules: "Revised maximum 500W. Venue requests equipment clarification.",
    });
    act(
      {
        type: "reviewPacket",
        id: "layout",
        decision: "change",
        text: "Confirm the equipment list stays within 500W.",
      },
      "venue",
    );
  }
  if (scene.startsWith("merchant-")) {
    act({ type: "reviewAllPacket" }, "venue");
    act({ type: "agree" }, "venue");
    act({ type: "publish" });
    act({ type: "advance", time: at("10-25", "10:00") });
    for (const app of s.applications.filter((a) => a.id !== "paper-and-clay"))
      act(
        { type: "submitApplication", id: app.id },
        "merchant",
        app.businessId,
      );
    act({ type: "advance", time: at("11-01", "10:00") });
    if (scene !== "merchant-entry") {
      act({ type: "submitApplication", id: "paper-and-clay" }, "merchant");
      act({
        type: "advance",
        time:
          scene === "merchant-before-close"
            ? at("11-05", "17:00")
            : at("11-06"),
      });
    }
    if (
      [
        "merchant-offer",
        "merchant-proof-review",
        "merchant-full-payment",
        "merchant-cancellation",
      ].includes(scene)
    ) {
      if (scene === "merchant-full-payment")
        act({ type: "saveTerms", terms: { ...s.event.terms, mode: "full" } });
      act({ type: "sendOffer", id: "brew-corner", booths: ["23"] });
      act({ type: "sendOffer", id: "paper-and-clay", booths: ["30", "31"] });
      if (
        scene === "merchant-proof-review" ||
        scene === "merchant-cancellation"
      ) {
        const id = s.agreements.at(-1)!.id;
        act({ type: "accept", id }, "merchant");
        act({ type: "advance", time: at("11-08", "17:00") });
        act(
          {
            type: "submitReceipt",
            id,
            reference: "DEMO-PAPER-DEPOSIT",
            amount: 200000,
          },
          "merchant",
        );
        if (scene === "merchant-cancellation") {
          act({
            type: "reviewReceipt",
            id: s.receipts.at(-1)!.id,
            decision: "verify",
            amount: 200000,
            reason: "Sample deposit received",
          });
          act({ type: "advance", time: at("11-09") });
          act(
            {
              type: "requestCancellation",
              id,
              reason:
                "Unable to attend; request under illustrative early withdrawal terms",
            },
            "merchant",
          );
        }
      }
    }
    if (scene === "merchant-waitlist") {
      for (const [id, booths] of [
        ["green-goods", ["21"]],
        ["brew-corner", ["23"]],
        ["sweet-tray", ["25"]],
        ["stitch-studio", ["27", "28"]],
        ["iced-sip", ["30"]],
        ["local-finds", ["32"]],
      ] as [string, string[]][])
        act({ type: "sendOffer", id, booths });
      act({
        type: "reviewApplication",
        id: "paper-and-clay",
        decision: "waitlist",
        text: "No suitable pair currently free; no queue position guaranteed.",
      });
    }
  }
  s.scene = scene;
  s.role = meta[2];
  s.identity = identityFor(s.role);
  s.navigation.route = meta[3];
  return s;
}
