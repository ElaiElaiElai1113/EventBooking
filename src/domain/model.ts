export type Role = "customer" | "venue" | "organizer" | "merchant";
export type Choice = string[];
export interface Venue {
  id: string;
  name: string;
  area: string;
  address: string;
  capacity: number;
  price: number;
  image: string;
  description: string;
  amenities: string[];
  restrictions: string;
  access: string;
}
export interface Booth {
  id: string;
  row: string;
  width: number;
  depth: number;
  price: number;
  power: boolean;
  watts: number;
  inclusions: string;
  restrictions: string;
  unavailable: boolean;
}
export interface Profile {
  id: string;
  name: string;
  contact: string;
  category: string;
  products: string;
  needs: string;
  power: boolean;
  watts: number;
  photo: string;
}
export interface ApplicationDraft extends Profile {
  quantity: 1 | 2;
  choices: Choice[];
  alternatives: boolean;
}
export interface Application {
  id: string;
  businessId: string;
  eventId: string;
  draft: ApplicationDraft;
  snapshots: { version: number; at: string; data: ApplicationDraft }[];
  status:
    | "draft"
    | "submitted"
    | "clarification"
    | "waitlisted"
    | "declined"
    | "withdrawn";
  notes: string;
  shortlisted: boolean;
  correctionRequested: boolean;
  messages: Message[];
  history: string[];
}
export interface Terms {
  version: number;
  mode: "deposit" | "full";
  percent: number;
  balanceDue: string;
  instructions: string;
  withdrawal: string;
  organizerCancellation: string;
  missedBalance: string;
  refundCutoff: string;
}
export interface Arrangement {
  version: number;
  agreedVersion: number | null;
  agreedAt?: string;
  rules: string;
  accessStart: string;
  accessEnd: string;
  existing: boolean;
  venueName: string;
  address: string;
  contact: string;
  prerequisite: "none" | "deposit";
  packet: PacketItem[];
  history: string[];
  snapshots: {
    version: number;
    rules: string;
    accessStart: string;
    accessEnd: string;
    booths: Booth[];
    pairs: Choice[];
  }[];
}
export interface PacketItem {
  id: string;
  title: string;
  owner: Role;
  required: boolean;
  applicable: boolean;
  version: number;
  supplied: boolean;
  reviewedVersion: number | null;
  change: string;
  preview: string;
}
export interface EventRecord {
  id: string;
  name: string;
  organizer: string;
  contact: string;
  description: string;
  start: string;
  end: string;
  setup: string;
  cleanup: string;
  opens: string;
  closes: string;
  decisions: string;
  categories: string;
  selection: string;
  status: "draft" | "published";
  terms: Terms;
  arrangement: Arrangement;
  booths: Booth[];
  pairs: Choice[];
  messages: Message[];
  meetings: Meeting[];
  history: string[];
}
export interface Agreement {
  contextSnapshot?: {
    eventName: string;
    start: string;
    end: string;
    setup: string;
    cleanup: string;
    arrangementVersion: number;
    rules: string;
    booths: Booth[];
  };
  id: string;
  kind: "merchant" | "venue";
  parentId: string;
  version: number;
  payerId: string;
  payerName: string;
  recipient: string;
  recipientRole: "organizer" | "venue";
  boothIds: Choice;
  venueId?: string;
  eventStart?: string;
  eventEnd?: string;
  accessStart?: string;
  accessEnd?: string;
  lineItems: { label: string; amount: number }[];
  total: number;
  initial: number;
  terms: Terms;
  issuedAt: string;
  expiresAt: string;
  acceptedAt?: string;
  status:
    | "active"
    | "accepted"
    | "confirmed"
    | "declined"
    | "expired"
    | "replaced"
    | "canceled";
  allocation: "held" | "confirmed" | "released";
  extensions: { at: string; until: string; reason: string }[];
  history: string[];
}
export interface Receipt {
  id: string;
  agreementId: string;
  payerId: string;
  recipient: string;
  reference: string;
  claimed: number;
  verified: number;
  submittedAt: string;
  timely: boolean;
  status: "submitted" | "needs-resolution" | "verified" | "rejected";
  reason: string;
}
export interface Cancellation {
  agreementId: string;
  requestedAt: string;
  reason: string;
  status: "requested" | "declined" | "confirmed";
  decidedAt?: string;
  decision: string;
  refundDue: number;
  refunds: { reference: string; amount: number; at: string }[];
}
export interface Inquiry {
  name: string;
  contact: string;
  purpose: string;
  guests: number;
  start: string;
  end: string;
  accessStart: string;
  accessEnd: string;
  package: string;
  needs: string;
}
export interface Booking {
  id: string;
  venueId: string;
  payerId: string;
  payerRole: "customer" | "organizer";
  draft: Inquiry;
  submitted: boolean;
  declined: boolean;
  messages: Message[];
  history: string[];
}
export interface Message {
  id: string;
  from: Role;
  text: string;
  at: string;
}
export interface Meeting {
  id: string;
  proposer: "venue" | "organizer";
  recipient: "venue" | "organizer";
  agenda: string;
  time: string;
  duration: number;
  kind: "online" | "in-person";
  details: string;
  state: "proposed" | "accepted" | "declined" | "canceled";
  history: string[];
}
export interface DemoState {
  schemaVersion: 1;
  revision: number;
  scene: string;
  now: string;
  role: Role;
  identity: string;
  venues: Venue[];
  profiles: Profile[];
  event: EventRecord;
  applications: Application[];
  bookings: Booking[];
  agreements: Agreement[];
  receipts: Receipt[];
  cancellations: Cancellation[];
  processed: string[];
  drafts: Record<string, Record<string, string>>;
  navigation: Record<string, string>;
}
export interface Issue {
  code: string;
  message: string;
  field?: string;
}
export type Result =
  | { ok: true; state: DemoState }
  | { ok: false; state: DemoState; issues: Issue[] };
