import type { DemoState } from "@/domain/model";
import { z } from "zod";
export const STORAGE_KEY = "eventbooking.demo.v1";
const str = z.string(),
  num = z.number().finite(),
  money = num.int().nonnegative(),
  role = z.enum(["customer", "venue", "organizer", "merchant"]),
  time = str.refine((v) => Number.isFinite(Date.parse(v)));
const choice = z.array(str),
  strings = z.array(str);
const profile = z.object({
  id: str,
  name: str,
  contact: str,
  category: str,
  products: str,
  needs: str,
  power: z.boolean(),
  watts: num,
  photo: str,
});
const draft = profile.extend({
  quantity: z.union([z.literal(1), z.literal(2)]),
  choices: z.array(choice),
  alternatives: z.boolean(),
});
const terms = z.object({
  version: num.int(),
  mode: z.enum(["deposit", "full"]),
  percent: num,
  balanceDue: str,
  instructions: str,
  withdrawal: str,
  organizerCancellation: str,
  missedBalance: str,
  refundCutoff: time,
});
const booth = z.object({
  id: str,
  row: str,
  width: num,
  depth: num,
  price: money,
  power: z.boolean(),
  watts: num,
  inclusions: str,
  restrictions: str,
  unavailable: z.boolean(),
});
const message = z.object({ id: str, from: role, text: str, at: time });
const inquiry = z.object({
  name: str,
  contact: str,
  purpose: str,
  guests: num,
  start: str,
  end: str,
  accessStart: str,
  accessEnd: str,
  package: str,
  needs: str,
});
const schema = z.object({
  schemaVersion: z.literal(1),
  revision: num.int().nonnegative(),
  scene: str,
  now: time,
  role,
  identity: str,
  venues: z
    .array(
      z.object({
        id: str,
        name: str,
        area: str,
        address: str,
        capacity: num,
        price: money,
        image: str,
        description: str,
        amenities: strings,
        restrictions: str,
        access: str,
      }),
    )
    .length(3),
  profiles: z.array(profile).length(8),
  event: z.object({
    id: str,
    name: str,
    organizer: str,
    contact: str,
    description: str,
    start: str,
    end: str,
    setup: str,
    cleanup: str,
    opens: str,
    closes: str,
    decisions: str,
    categories: str,
    selection: str,
    status: z.enum(["draft", "published"]),
    terms,
    booths: z.array(booth),
    pairs: z.array(choice),
    history: strings,
    messages: z.array(message),
    meetings: z.array(
      z.object({
        id: str,
        proposer: z.enum(["venue", "organizer"]),
        recipient: z.enum(["venue", "organizer"]),
        agenda: str,
        time,
        duration: num,
        kind: z.enum(["online", "in-person"]),
        details: str,
        state: z.enum(["proposed", "accepted", "declined", "canceled"]),
        history: strings,
      }),
    ),
    arrangement: z.object({
      version: num.int(),
      agreedVersion: num.int().nullable(),
      agreedAt: time.optional(),
      rules: str,
      accessStart: str,
      accessEnd: str,
      existing: z.boolean(),
      venueName: str,
      address: str,
      contact: str,
      prerequisite: z.enum(["none", "deposit"]),
      packet: z.array(
        z.object({
          id: str,
          title: str,
          owner: role,
          required: z.boolean(),
          applicable: z.boolean(),
          version: num.int(),
          supplied: z.boolean(),
          reviewedVersion: num.int().nullable(),
          change: str,
          preview: str,
        }),
      ),
      history: strings,
      snapshots: z.array(
        z.object({
          version: num.int(),
          rules: str,
          accessStart: time,
          accessEnd: time,
          booths: z.array(booth),
          pairs: z.array(choice),
        }),
      ),
    }),
  }),
  applications: z
    .array(
      z.object({
        id: str,
        businessId: str,
        eventId: str,
        draft,
        snapshots: z.array(
          z.object({ version: num.int(), at: time, data: draft }),
        ),
        status: z.enum([
          "draft",
          "submitted",
          "clarification",
          "waitlisted",
          "declined",
          "withdrawn",
        ]),
        notes: str,
        shortlisted: z.boolean(),
        correctionRequested: z.boolean(),
        messages: z.array(message),
        history: strings,
      }),
    )
    .length(8),
  bookings: z.array(
    z.object({
      id: str,
      venueId: str,
      payerId: str,
      payerRole: z.enum(["customer", "organizer"]),
      draft: inquiry,
      submitted: z.boolean(),
      declined: z.boolean(),
      messages: z.array(message),
      history: strings,
    }),
  ),
  agreements: z.array(
    z.object({
      contextSnapshot: z
        .object({
          eventName: str,
          start: time,
          end: time,
          setup: time,
          cleanup: time,
          arrangementVersion: num.int(),
          rules: str,
          booths: z.array(booth),
        })
        .optional(),
      id: str,
      kind: z.enum(["merchant", "venue"]),
      parentId: str,
      version: num.int(),
      payerId: str,
      payerName: str,
      recipient: str,
      recipientRole: z.enum(["organizer", "venue"]),
      boothIds: choice,
      venueId: str.optional(),
      eventStart: time.optional(),
      eventEnd: time.optional(),
      accessStart: time.optional(),
      accessEnd: time.optional(),
      lineItems: z.array(z.object({ label: str, amount: money })),
      total: money,
      initial: money,
      terms,
      issuedAt: time,
      expiresAt: time,
      acceptedAt: time.optional(),
      status: z.enum([
        "active",
        "accepted",
        "confirmed",
        "declined",
        "expired",
        "replaced",
        "canceled",
      ]),
      allocation: z.enum(["held", "confirmed", "released"]),
      extensions: z.array(z.object({ at: time, until: time, reason: str })),
      history: strings,
    }),
  ),
  receipts: z.array(
    z.object({
      id: str,
      agreementId: str,
      payerId: str,
      recipient: str,
      reference: str,
      claimed: money,
      verified: money,
      submittedAt: time,
      timely: z.boolean(),
      status: z.enum(["submitted", "needs-resolution", "verified", "rejected"]),
      reason: str,
    }),
  ),
  cancellations: z.array(
    z.object({
      agreementId: str,
      requestedAt: time,
      reason: str,
      status: z.enum(["requested", "declined", "confirmed"]),
      decidedAt: time.optional(),
      decision: str,
      refundDue: money,
      refunds: z.array(z.object({ reference: str, amount: money, at: time })),
    }),
  ),
  processed: strings,
  drafts: z.record(z.record(str)),
  navigation: z.record(str),
});
export function decode(raw: string): DemoState {
  return schema.parse(JSON.parse(raw));
}
export function save(
  storage: Pick<Storage, "setItem">,
  state: DemoState,
): { ok: boolean; error?: string } {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Browser storage unavailable",
    };
  }
}
