# Connected demo readiness — T14

20 September 2026. **Design only: Supabase not connected; Vercel not deployed.** This document is neither a migration nor permission to change a cloud project. Local simulated roles and payment references establish workflow behavior only.

## Reuse and adapter boundary

Keep the React screens and typed commands in `src/domain/commands.ts`. Replace the browser persistence implementation behind `src/demo/demo-provider.tsx` with a scoped adapter:

```ts
interface EventPlatformAdapter {
  loadView(route: string): Promise<AuthorizedView>;
  submit(command: DomainAction, idempotencyKey: string,
    expectedRevision: number): Promise<CommandResult>;
  refresh(route: string): Promise<AuthorizedView>;
}
```

These names describe a future contract, not exported implemented types. The server derives actor identity and memberships from the authenticated session; callers cannot supply an authoritative role, recipient, verified amount, organization or clock. Return only the records needed by that actor and route. Do not store or expose the entire local `DemoState` as a public JSON row. Keep fictional presenter controls out of the connected authorization path. Server time determines deadlines, and server-side transactions repeat all validation even if the UI has already checked it.

## Data and enforcement mapping

| Local records | Future persisted records | Enforcement required |
| --- | --- | --- |
| Presenter identity and profiles | Users, organizations, staff memberships, merchant businesses, business memberships | Actual authenticated identity; protected membership administration; organization/venue ownership checked for every read and command. Client role selectors and user-editable JWT metadata cannot grant access. |
| Venues and bookings | Venues, whole-venue resources, inquiries, quote versions, access claims | Participant-only inquiry/quote history; immutable accepted snapshots; exclusive active access ranges including setup/cleanup. |
| Event and arrangement | Events, arrangement versions, venue agreements, packet item versions | Separate venue rental from venue arrangement agreement. Only the owning venue agrees; only organizer publishes. Publication checks current versions and prerequisites in one transaction. |
| Booths and pairs | Edition booths and explicit pair links | Valid geometry, no numeric adjacency inference, positive integer-centavo prices and dimensions. Restrict layout edits to owner and preserve accepted snapshots. |
| Applications | Applications, immutable submissions, ranked preferences, clarification records | Unique business/event edition; own business reads/writes; organizer reviews; private notes in separate protected records. Submitted versions cannot change through profile editing. |
| Offers | Offer versions, allocation groups, booth claims | One active offer/application and one live claim/booth; group a pair so reserve/confirm/release never affect only half. Snapshot prices, terms, event dates and booth facts. |
| Receipts | Agreement-specific submitted references and verification ledger | Payer submits; actual receiving business verifies. Unique/idempotent receipt review, normalized duplicate-reference handling, positive bounded integer amounts, no self-verification. Do not infer real receipt from a client upload or callback without verification. |
| Cancellations and refunds | Requests, decisions, refund obligations and entries | Request alone does not release; receiving business decides. Stop future collectible balance only on confirmed cancellation. Refund entries cannot exceed the obligation or credit another agreement. |
| Messages and meetings | Context-scoped messages, meeting proposals and responses | Only actual participants; optional acceptance does not approve an arrangement. External delivery is a separately scoped integration. |
| Packet/image placeholders | Private storage objects, versions and access records, if uploads are later requested | Private buckets; authenticated object ownership and bounded signed links; file size/type checks, access tests, deletion retention rules. No public private packet URLs. |

## Transaction boundaries and concurrency acceptance

1. **Offer and allocation:** lock the application and all selected booth rows in stable order; check eligibility/current agreement/closing time/payment feasibility; insert immutable offer plus all claims atomically. Database uniqueness or equivalent locked enforcement must make two concurrent offers for a booth impossible. A failure on the second booth rolls back both claims and any replacement release.
2. **Quote and interval hold:** lock the whole-venue resource; check overlaps against active held/confirmed claims with explicit interval boundary semantics; create the quote and full access claim in one transaction. Consider a Postgres range exclusion constraint on active resource claims plus a transaction for version replacement. Test adjacent non-overlapping intervals and setup/cleanup-only conflicts.
3. **Receipt review and confirmation:** lock agreement, pending receipt and allocation group; authenticate recipient; verify a unique matching reference and bounded amount; add immutable ledger credit; confirm the same still-valid claim only after the required total is reached. Reject stale, duplicate and already-final reviews. No late payment can take someone else's allocation.
4. **Cancellation and release:** lock agreement, allocation group and cancellation; preserve accepted contract and paid ledger; record decision, release the whole group, stop sample future collection and create any refund obligation atomically. A later refund record is its own idempotent command, never an automatic consequence of cancellation.
5. **Expiry:** use server time and lock each candidate agreement before release. Recheck timely unresolved proof and verified partial receipts inside the transaction. Record overdue review follow-up without automatically reallocating protected space. Coordinate scheduler and foreground commands so expiration cannot race verification or acceptance.
6. **Publication and revisions:** check the exact arrangement/packet versions, schedule, terms, inventory, access and optional rental prerequisite together. Material revision pauses publication/new offers until venue agreement is current. Existing accepted snapshots stay intact.

Require two independent authenticated sessions to race each conflicting action. Cover same application and different applications sharing one booth; reversed pair order/deadlock handling; half-pair failure; duplicate callback/command; receipt vs expiry; cancellation vs verification; quote vs quote; edit vs publication. Test transaction rollback and retries with the same idempotency key. Local reducer tests cannot establish these guarantees.

## Security and migration gate

Before implementation, choose a dedicated non-production project with explicit authorization and inspect existing schemas, migrations and exposure. Re-read the Supabase skill, [current changelog](https://supabase.com/changelog) and [API security guidance](https://supabase.com/docs/guides/api/securing-your-api). Recheck actual supported SDK/runtime versions; this local package lock contains no Supabase SDK.

Define minimal schema privileges and Data API exposure explicitly, then RLS for every exposed table. Audit views/functions, security-definer search paths and execute privileges; keep privileged keys in server-only environment variables. RLS and grants have distinct responsibilities. Generate reviewed migrations with the current project tool workflow, apply to the selected isolated environment, and retain rollback/restore procedures. Do not depend on assumed defaults for a new project.

Test unauthenticated, wrong business, wrong organizer, wrong venue, revoked membership and ordinary member access against every read and write. Include guessed IDs, nested joins, views, functions, storage paths and signed URLs. Verify that public views contain no private packet, rental balance, merchant contact details, competing applications or staff notes. Log useful audit metadata without exposing payment evidence or contact information.

## Later Vercel preview procedure

1. On a separate publishing request, identify the exact account/team/project and intended environment, source revision and supported Node runtime. Determine whether it is a browser-local fictional preview or the connected demo; label the choice explicitly.
2. Run the final checks and production build for that revision. Build command is `npm run build`; use the lockfile. For a local-only preview no provider secrets are required. For connected preview, supply only its dedicated environment's required variables; never expose privileged keys through `NEXT_PUBLIC_*`.
3. Read [current Vercel environment behavior](https://vercel.com/docs/deployments/environments). In particular, verify how the first project deployment is classified before issuing any command; do not assume omission of a production flag guarantees a preview. Resolve the target to the authorized environment before publishing.
4. Deploy only to the authorized preview target. Preserve `noindex` metadata and fictional/demo labeling. Preview protection and search directives serve different purposes. A production domain or production environment is separate work.
5. Check the actual URL on desktop/mobile: direct dynamic routes, refresh, image/font loads, recovery, all three role journeys, current provider configuration and private-view boundaries. For a connected demo also repeat authorization/concurrency tests against that environment. Record URL, revision, runtime, deployment environment, migrations, test date and limitations.

Hosting a local-only build does not provide shared state, trustworthy identity, payment authenticity or production security. A successful build is not a deployed result, and a deployed result is not user acceptance.

## Operating inputs still needed for a live pilot

Real venue document examples and access constraints; approved prices, payment instructions, cancellation/change/refund wording; identity and membership ownership; staff receipt-review commitments, escalation and support; actual delivery/provider scope; commercial validation and pilot consent. None are fabricated by this local demo or blockers to its fictional scenes.

| Stage | Evidence as delivered |
| --- | --- |
| Local implementation and checks | See `implementation-evidence.md` for measured results and limitations. |
| Supabase connection/security/concurrency | Not performed. |
| Vercel deployment/hosted acceptance | Not performed. |
| Independent user validation/real onboarding | Not performed. |
| Real payments, communications, files or customer data | Not used. |
