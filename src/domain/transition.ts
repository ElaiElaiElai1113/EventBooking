import type { Command } from "./commands";
import type { DemoState, Result } from "./model";
import { RuleError, requireRule } from "./validation";
import { eventCommand } from "./publication";
import { applicationCommand } from "./applications";
import { offerCommand } from "./offers";
import { venueCommand } from "./venue-booking";
import { paymentCommand } from "./payments";
import { cancellationCommand } from "./cancellation";
import { coordinationCommand } from "./coordination";
import { paid, unresolved } from "./selectors";
import { stamp } from "./time";
export function expire(s: DemoState) {
  for (const a of s.agreements) {
    if (
      a.allocation === "held" &&
      stamp(s.now) >= stamp(a.expiresAt) &&
      !unresolved(s, a.id).some((r) => r.timely) &&
      paid(s, a.id) === 0
    ) {
      a.status = "expired";
      a.allocation = "released";
      a.history.push(
        `${s.now}: Unpaid hold expired; complete allocation released.`,
      );
    }
  }
}
export function transition(state: DemoState, command: Command): Result {
  if (state.processed.includes(command.commandId)) return { ok: true, state };
  try {
    requireRule(
      command.expectedRevision === state.revision,
      "STALE",
      "This view is out of date. Refresh and review; your input is preserved.",
    );
    const s = structuredClone(state);
    expire(s);
    if (command.type === "advance") {
      requireRule(
        Number.isFinite(stamp(command.time)) &&
          stamp(command.time) >= stamp(s.now),
        "TIME",
        "Demo time can only move forward. Load a scene explicitly to restart.",
      );
      s.now = command.time;
      expire(s);
    } else
      requireRule(
        [
          eventCommand,
          applicationCommand,
          offerCommand,
          venueCommand,
          paymentCommand,
          cancellationCommand,
          coordinationCommand,
        ].some((fn) => fn(s, command)),
        "COMMAND",
        "Unknown action.",
      );
    s.revision++;
    s.processed.push(command.commandId);
    return { ok: true, state: s };
  } catch (error) {
    if (error instanceof RuleError)
      return {
        ok: false,
        state,
        issues: [
          { code: error.code, message: error.message, field: error.field },
        ],
      };
    throw error;
  }
}
