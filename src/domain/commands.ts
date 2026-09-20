import type {
  ApplicationDraft,
  Booth,
  Choice,
  EventRecord,
  Inquiry,
  Role,
  Terms,
} from "./model";
export type Action =
  | { type: "saveApplication"; id: string; draft: ApplicationDraft }
  | { type: "submitApplication"; id: string }
  | { type: "saveProfile"; id: string; name: string }
  | {
      type: "reviewApplication";
      id: string;
      decision: "shortlist" | "waitlist" | "decline" | "clarify" | "note";
      text: string;
    }
  | { type: "withdrawApplication"; id: string }
  | { type: "sendOffer"; id: string; booths: Choice; replace?: boolean }
  | { type: "accept"; id: string }
  | { type: "decline"; id: string }
  | { type: "extend"; id: string; until: string; reason: string }
  | { type: "submitReceipt"; id: string; reference: string; amount: number }
  | {
      type: "reviewReceipt";
      id: string;
      decision: "verify" | "resolve" | "reject";
      amount: number;
      reason: string;
    }
  | { type: "requestCancellation"; id: string; reason: string }
  | {
      type: "decideCancellation";
      id: string;
      confirm: boolean;
      reason: string;
      refund: number;
    }
  | { type: "refund"; id: string; reference: string; amount: number }
  | { type: "saveInquiry"; id: string; venueId: string; draft: Inquiry }
  | { type: "submitInquiry"; id: string }
  | { type: "declineInquiry"; id: string; reason: string }
  | {
      type: "quote";
      eventStart?: string;
      eventEnd?: string;
      id: string;
      total: number;
      initial: number;
      accessStart: string;
      accessEnd: string;
      balanceDue: string;
      inclusions: string;
      terms?: Terms;
    }
  | {
      type: "saveEvent";
      patch: Partial<
        Pick<
          EventRecord,
          | "name"
          | "organizer"
          | "contact"
          | "description"
          | "start"
          | "end"
          | "setup"
          | "cleanup"
          | "opens"
          | "closes"
          | "decisions"
          | "categories"
          | "selection"
        >
      >;
    }
  | { type: "saveTerms"; terms: Terms }
  | {
      type: "saveArrangement";
      rules: string;
      accessStart: string;
      accessEnd: string;
      existing: boolean;
      venueName: string;
      address: string;
      contact: string;
      prerequisite: "none" | "deposit";
    }
  | { type: "editBooth"; booth: Booth }
  | { type: "editPairs"; pairs: Choice[] }
  | { type: "supplyPacket"; id: string; preview: string }
  | {
      type: "reviewPacket";
      id: string;
      decision: "review" | "change" | "not-applicable";
      text: string;
    }
  | { type: "reviewAllPacket" }
  | { type: "agree" }
  | { type: "publish" }
  | { type: "message"; context: string; text: string }
  | {
      type: "meeting";
      agenda: string;
      time: string;
      duration: number;
      kind: "online" | "in-person";
      details: string;
    }
  | {
      type: "respondMeeting";
      id: string;
      decision: "accept" | "counter" | "decline" | "cancel";
      time?: string;
    }
  | { type: "advance"; time: string };
export type Command = Action & {
  commandId: string;
  actorId: string;
  role: Role;
  expectedRevision: number;
};
