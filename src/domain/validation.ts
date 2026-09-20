import type { DemoState, Role, Agreement } from "./model";
import type { Command } from "./commands";
export class RuleError extends Error {
  constructor(
    public code: string,
    message: string,
    public field?: string,
  ) {
    super(message);
  }
}
export function requireRule(
  condition: unknown,
  code: string,
  message: string,
  field?: string,
): asserts condition {
  if (!condition) throw new RuleError(code, message, field);
}
export function actor(c: Command, role: Role, id?: string) {
  requireRule(
    c.role === role && (!id || c.actorId === id),
    "ROLE",
    "Switch to the responsible demo role and identity for this action.",
  );
}
export function receiver(c: Command, a: Agreement) {
  actor(
    c,
    a.recipientRole,
    a.kind === "venue" ? a.venueId : "sample-market-team",
  );
}
export function payer(c: Command, a: Agreement) {
  actor(
    c,
    a.kind === "merchant"
      ? "merchant"
      : a.payerId === "sample-market-team"
        ? "organizer"
        : "customer",
    a.payerId,
  );
}
export function amount(value: number) {
  requireRule(
    Number.isSafeInteger(value) && value > 0,
    "AMOUNT",
    "Enter a positive amount in centavos.",
  );
}
export function agreement(s: DemoState, id: string) {
  const a = s.agreements.find((a) => a.id === id);
  requireRule(a, "MISSING", "This agreement does not exist.");
  return a;
}
