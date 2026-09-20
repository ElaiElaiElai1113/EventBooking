import type { DemoState } from "./model";
import type { Command } from "./commands";
import { actor, requireRule } from "./validation";
import { stamp } from "./time";
export function coordinationCommand(s: DemoState, c: Command): boolean {
  if (c.type === "message") {
    requireRule(c.text.trim(), "MESSAGE", "Write a sample message.");
    let messages = s.event.messages;
    if (c.context === "event") {
      requireRule(
        c.role === "organizer" || c.role === "venue",
        "ROLE",
        "Only event participants can see this conversation.",
      );
      actor(
        c,
        c.role,
        c.role === "venue" ? "sample-hall" : "sample-market-team",
      );
    } else {
      const b = s.bookings.find((b) => b.id === c.context),
        a = s.applications.find((a) => a.id === c.context);
      requireRule(b || a, "CONTEXT", "Conversation not found.");
      if (b) {
        requireRule(
          (c.role === "venue" && c.actorId === b.venueId) ||
            (c.role === b.payerRole && c.actorId === b.payerId),
          "ROLE",
          "This is a private booking conversation.",
        );
        messages = b.messages;
      }
      if (a) {
        requireRule(
          (c.role === "organizer" && c.actorId === "sample-market-team") ||
            (c.role === "merchant" && c.actorId === a.businessId),
          "ROLE",
          "This is a private application conversation.",
        );
        messages = a.messages;
      }
    }
    messages.push({
      id: `message-${s.revision + 1}`,
      from: c.role,
      text: c.text.trim(),
      at: s.now,
    });
    return true;
  }
  if (c.type === "meeting") {
    requireRule(
      c.role === "organizer" || c.role === "venue",
      "ROLE",
      "Only organizer and venue can propose meetings.",
    );
    actor(c, c.role, c.role === "venue" ? "sample-hall" : "sample-market-team");
    requireRule(
      c.agenda.trim() &&
        c.details.trim() &&
        c.duration > 0 &&
        stamp(c.time) > stamp(s.now),
      "MEETING",
      "Add agenda, location, duration and a future sample time.",
    );
    s.event.meetings.push({
      id: `meeting-${s.revision + 1}`,
      proposer: c.role,
      recipient: c.role === "venue" ? "organizer" : "venue",
      agenda: c.agenda,
      time: c.time,
      duration: c.duration,
      kind: c.kind,
      details: c.details,
      state: "proposed",
      history: [`${s.now}: Proposed by ${c.role}.`],
    });
    return true;
  }
  if (c.type === "respondMeeting") {
    const m = s.event.meetings.find((m) => m.id === c.id);
    requireRule(m, "MEETING", "Meeting not found.");
    requireRule(
      c.role === "organizer" || c.role === "venue",
      "ROLE",
      "Only participants can respond.",
    );
    actor(c, c.role, c.role === "venue" ? "sample-hall" : "sample-market-team");
    requireRule(
      !["canceled", "declined"].includes(m.state),
      "MEETING",
      "This meeting is closed.",
    );
    if (c.decision === "cancel") m.state = "canceled";
    else {
      requireRule(
        c.role === m.recipient,
        "RECIPIENT",
        "The recipient must respond to the proposal.",
      );
      if (c.decision === "counter") {
        requireRule(
          c.time && stamp(c.time) > stamp(s.now),
          "MEETING",
          "Suggest a future sample time.",
        );
        m.time = c.time;
        m.proposer = c.role;
        m.recipient = c.role === "venue" ? "organizer" : "venue";
        m.state = "proposed";
      } else {
        requireRule(
          m.state === "proposed",
          "MEETING",
          "Only a pending proposal can be answered.",
        );
        m.state = c.decision === "accept" ? "accepted" : "declined";
      }
    }
    m.history.push(`${s.now}: ${c.role} ${c.decision}.`);
    return true;
  }
  return false;
}
