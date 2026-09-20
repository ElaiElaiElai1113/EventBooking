# Local implementation evidence

20 September 2026. Stage A, fictional local demo. **Not connected to Supabase, not deployed to Vercel, not independently user accepted.** **R01–R48: 48 Verified locally, 0 unresolved local acceptance rows.** T01–T14 local work is complete within the fixed-scene scope and limits below. No row is marked User accepted.

## Delivered behavior

The customer, venue, organizer and merchant views use one typed state and transition boundary. An inquiry creates no reservation; the venue quotes and holds the full access interval, the customer accepts and submits a fictional reference, and only venue verification confirms. Organizer setup stays editable during current-version venue review; messages and meetings cannot substitute for explicit agreement. Merchants apply once with ranked choices; only the organizer offers an exact allocation after closing, and only sufficient verified receipts confirm it.

The application includes all nine planned screen families, 13 named presets covering scenes A–J, three fictional venues, twelve booths, ten explicit pairs, eight merchant records, and separate private/organizer rental dates. Paper and Clay starts as a draft beside seven submissions in the merchant-entry scene. The main browser journey submits the eighth application, offers Brew Corner 23, then offers Paper and Clay 30+31 without deleting its first preference or holding 24.

## Environment and reproducibility

- Windows / PowerShell; Node **22.23.2**, npm **11.3.0**. Next **16.3.5**, React **19.3.0**, TypeScript **5.9.3**, Vitest **5.0.1**, Playwright **1.63.0**. Exact dependency versions and `package-lock.json` are included.
- Manually initialized the documentation-only workspace. No generator overwrote the planning files. No Git initialization, commit, push, purchase, provider call, external message or cloud mutation was performed.
- Installed Next guidance was read before implementation. Next generated `AGENTS.md`/`CLAUDE.md`; these files are retained. Initial CommonJS config failure was corrected with the package's ESM declaration. PowerShell npm port forwarding was avoided by using the direct Next CLI for the test server.
- Fonts and illustrative images are local; [asset provenance](asset-register.md) is recorded. Runtime checks report no external requests. The small presenter strip and `noindex` metadata distinguish the fictional demonstration.
- [README](../README.md) contains install/start/test/reset instructions. Final Playwright uses the production build on `127.0.0.1:3100`, one worker, desktop Chromium and Pixel 5 Chromium; `DEMO_DEV_CHECK` is not enabled for acceptance.

## Task record

| Task | Local output and evidence |
| --- | --- |
| T01 | Manual Next/TypeScript initialization, exact lockfile, lint/type/unit/browser harness. |
| T02 | Warm cream/green/clay token system, local DM Sans/Fraunces, customized Radix/CVA button, forms, dialogs, status/notice/history primitives. |
| T03 | Typed fixtures and thirteen deterministic scenes, schema-validated persistence, explicit load/reset, role/identity/clock controls, saved/failure/recovery states. |
| T04 | Pure guarded commands, explicit adjacency, atomic group allocation, integer money, time boundaries, idempotency/revision checks, publication and version rules. |
| T05 | Venue discovery, booth selection and organizer review styled and browser-reviewed first. Original `t05-*.png` and [checkpoint results](evidence/t05-results.json) retained separately from final images. |
| T06 | Five setup steps, versioned packet/arrangement review, supplied vs reviewed/change states, participant messages/meetings, publication gating and public window states. |
| T07 | Venue filters/details/inquiry, shared booking records, whole-access quote holds, conflict handling, quote revision, acceptance, receipt review and private calendar interval list. |
| T08 | Three-step merchant form, raw draft autosave, keyboard/touch map/list choices, profile/submission separation and deliberate same-record corrections. |
| T09 | Matching submission filters, booth comparison, private notes/shortlist/questions and exact offer editor including explicit single-booth substitution. |
| T10 | Accepted snapshot, required deposit/full amount, submitted vs verified receipts, duplicate/partial/unclear/late resolution, protected overdue review, extensions and expiry. |
| T11 | Request/decision/release/refund separation; confirmed-only private roster and print stylesheet. |
| T12 | Three entry journeys, persistent last route, explicit scene replacement, synchronized role perspectives and all A–J presets. |
| T13 | Domain/component/browser checks, six-width visual review, accessibility, image failure, print and measured lab performance; master comparison below. |
| T14 | [Connected-demo readiness](connected-demo-readiness.md): adapter, relational mapping, authoritative transactions, permission/concurrency tests and later deployment gates. Documentation only. |

## Verification

The final command sequence is `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:e2e`. It is run again after material fixes; historical failures are not counted as passing checks.

| Check | Evidence |
| --- | --- |
| ESLint | [Final lint output](evidence/final-lint.txt) — no errors or warnings. |
| TypeScript | [Final typecheck output](evidence/final-typecheck.txt) — passes. |
| Domain/component suite | [Final unit output](evidence/final-unit.txt) — 56 tests across eight files; all pass. |
| Production build | [Final build output](evidence/final-build.txt) — all application routes built. |
| Full Chromium suite | [Final browser output](evidence/final-browser.txt) — 28 scenarios on each of desktop and Pixel 5 Chromium, 56 total — **56 passed in 44.3 seconds**, retries disabled. |
| Additional direct browser checks | [Extra check results](evidence/extra-check-results.json) — filters/no results/date carry-through/inquiry refresh, open-inquiry axe scan, meeting counter/accept/cancel/decline. |
| Visual/network/performance | [Final structured report](evidence/final-visual-results.json); screenshots in `docs/evidence/final-*.png`. |
| Firefox | Firefox 155.0 inquiry-to-received smoke, recorded in the final structured report. This is not full Firefox parity coverage. |

### Scenes A–J

| Scene | Exercised behavior | Main test source |
| --- | --- | --- |
| A | No hold on inquiry; one full-access quote hold; acceptance/proof insufficient; venue verification confirms with matching customer balance. | [venue.spec.ts](../tests/e2e/venue.spec.ts) |
| B | Conflicting second inquiry retained without a second hold; contextual alternative-time proposal. Revised unaccepted quote has new date/price version and requires exact acceptance. | [venue.spec.ts](../tests/e2e/venue.spec.ts), [regressions.test.ts](../tests/unit/regressions.test.ts) |
| C | Missing agreement blocks publish; current supplied/reviewed packet and explicit agreement unlock publication; material revision pauses publication. | [organizer.spec.ts](../tests/e2e/organizer.spec.ts), [regressions.test.ts](../tests/unit/regressions.test.ts) |
| D | Participant messages, meeting proposal/acceptance; counter, cancel and decline independently checked; no implied venue agreement. | [organizer.spec.ts](../tests/e2e/organizer.spec.ts), [extra-check.mjs](../scripts/extra-check.mjs) |
| E | Seven-to-eight submission, Brew 23, preserved losing choice, backup 30+31, receipt review, pair confirmation and accurate private roster. | [merchant.spec.ts](../tests/e2e/merchant.spec.ts) |
| F | 26+27 rejected; before-close offer disabled; profile edits preserve submitted version; keyboard map/list parity. | [merchant.spec.ts](../tests/e2e/merchant.spec.ts), [booth-choice.test.tsx](../tests/components/booth-choice.test.tsx) |
| G | Unpaid pair expires together; extension visible on both sides; timely proof protects overdue hold; late proof cannot reclaim booth 30 after another merchant receives it. | [timing.spec.ts](../tests/e2e/timing.spec.ts) |
| H | Deposit confirms with balance; full-payment partial receipt remains held/incomplete; sufficient verified full total confirms without balance. Duplicate, wrong payer, unresolved and overpayment guards also tested. | [timing.spec.ts](../tests/e2e/timing.spec.ts), [workflows.test.ts](../tests/unit/workflows.test.ts), [extended-rules.test.ts](../tests/unit/extended-rules.test.ts) |
| I | Waitlist has no allocation/queue promise; single-booth substitute is explicit and requires merchant acceptance. | [presenter.spec.ts](../tests/e2e/presenter.spec.ts) |
| J | Cancellation request keeps confirmed pair; organizer decision releases both, stops future collectible balance, records refund due; explicit refund completion remains separate and rental unchanged. | [cancellation.spec.ts](../tests/e2e/cancellation.spec.ts), [extended-rules.test.ts](../tests/unit/extended-rules.test.ts) |

### Visual and accessibility review

Final screenshot matrix covers twelve critical screens at **320, 360, 390, 768, 1024 and 1440 CSS pixels**: discovery, venue detail, booking, venue workspace, setup, venue review, public event, booth form, organizer review, pending proof, cancellation and roster. It checks page overflow and loaded image dimensions at each width. Long business names, empty filters, invalid fields, held/expired pairs and payment/cancellation states also appear in browser tests.

Visually inspected examples include [discovery desktop](evidence/final-discovery-1440.png), [discovery 320](evidence/final-discovery-320.png), [venue 1024](evidence/final-venue-1024.png), [tablet venue workspace](evidence/final-venue-workspace-768.png), [booths 320](evidence/final-booths-320.png), [organizer review](evidence/final-review-1440.png), [setup mobile](evidence/final-setup-390.png), [venue review mobile](evidence/final-venue-review-390.png), [public event mobile](evidence/final-public-event-390.png), [quote mobile](evidence/final-booking-390.png), [proof mobile](evidence/final-proof-390.png), [cancellation mobile](evidence/final-cancellation-390.png) and [roster desktop](evidence/final-roster-1440.png). Full-height screenshots can appear reduced in an inline preview; open the original to inspect text.

The small-screen map keeps readable booth buttons in a contained horizontal scroller, with an explicit scroll hint and equivalent list view. Native date controls follow the browser's locale; summaries always use explicit Philippine dates/PHT. The calendar is an accessible interval list, not a fabricated month-grid/calendar integration.

Fourteen axe scans in the main suite cover seven key pages on desktop/mobile; a separate open-inquiry scan covers the actual inquiry form. Checks use WCAG 2 A/AA, 2.1 AA and 2.2 AA tags. Keyboard checks cover dialog entry/Escape/focus return, invalid-field recovery, and pair selection using Enter/Space. Status text is not color-only. Reduced motion yields zero transition duration in the sampled control. Enlarged body/form text at 200% was checked at 390px, with [retained list content](evidence/final-enlarged-list-390.png). These checks do not establish full WCAG conformance, real-device coverage or a screen-reader user study.

Images have reserved dimensions, local optimization, visible fictional labels and a tested [unavailable-image fallback](evidence/final-image-fallback.png). System font fallbacks are declared. No page errors, normal-load broken images or external runtime requests were observed in the final visual report.

The final matrix reports **72/72 screen-width combinations without page overflow or broken images**. The [one-page roster PDF](evidence/final-roster-print.pdf) was rendered with Poppler and [visually inspected](evidence/final-roster-pdf-render.png); pypdf confirmed all five columns, Paper and Clay, booth pair 30+31 and both PHP 2,000 amounts. The print action is absent. [Extracted print text](evidence/final-print-text.txt) is retained.

### Local performance

The reproducible script samples `/venues` three times per profile in fresh Chromium contexts with browser cache disabled. Desktop uses 1440×1000, no added throttling. The constrained mobile sample uses 390×844, DPR 1, 4× CPU throttling, 150ms added latency, 200,000 bytes/s download and 50,000 bytes/s upload. These are synthetic local conditions on this Windows host, not a physical phone or a public deployment. LCP and CLS come from PerformanceObserver after content and network settle; later below-fold scrolling is not a field session.

The measured results and exact timestamps are in [final-visual-results.json](evidence/final-visual-results.json). The final run at **2026-09-20 10:14:29 UTC** measured median desktop LCP **104ms**, constrained-mobile LCP **1892ms**, desktop CLS **0**, and mobile CLS **0.0001113**. Both sample profiles were within the brief's 2.5s LCP / 0.1 CLS goals. Roughly 383–386KB transferred in the sampled resource entries. **No field INP percentile was measured or claimed.** The 200ms INP and 75th-percentile field goals require a later instrumented hosted/pilot environment.

## Corrections found during implementation

- Material event edits initially left publication open; revisions now pause publication/new offers until current agreement. A canceled rental can no longer satisfy the optional publication-deposit prerequisite.
- Quote validation now includes requested setup/cleanup, with explicit quoted event dates for a revised alternative time. Accepted versions cannot be overwritten. Offer snapshots include dates, rules and booth facts.
- Early presets initially contained future-dated submitted applications. Scenes now submit through normal guards at the appropriate sample time; all thirteen presets have no future submissions.
- Draft business changes initially needed Continue before review tabs reflected them; the same local draft now updates immediately. Unsubmitted merchant drafts are excluded from organizer detail selection, and filtered detail matches the filtered submission list.
- Mobile map sizing initially expanded a grid and obstructed a dialog; grid children now shrink and only the map scrolls. A 768px quote form also overflowed; narrow forms now stack. Print rules now hide the action and fit the complete roster columns.
- Presenter clock input and Continue route now follow the loaded scene/current navigation. Form save hints report in-memory-only edits if localStorage fails.
- Harness fixes: component Testing Library does not accept Playwright's `exact` option; the shortlist button label is `Remove from shortlist`; the open-inquiry axe script requires an explicit browser context. These were corrected without changing business assertions.
- One intermediate run had two Chromium `ERR_NO_BUFFER_SPACE` failures fetching a local JS chunk. Traces showed the browser resource error; no application bypass/retry was added. A fresh full suite passed with retries disabled. Final evidence does not count the failed run as success.

## Requirement comparison

The master requirement text is unchanged. Each row below identifies implemented local behavior and the narrow evidence used. "Verified locally" never means user accepted, secure multi-user behavior, payment authenticity or hosted readiness. The final master rows link to these anchors.

| ID | Local result | Behavior and evidence |
| --- | --- | --- |
| <a id="r01"></a>R01 | Verified locally | All three end-to-end journeys and four roles reach local outcomes. [venue, organizer and merchant browser suites](../tests/e2e/merchant.spec.ts). |
| <a id="r02"></a>R02 | Verified locally | Only organizer commands select merchants; venue perspective has no selection action. [role guard and private-perspective browser assertions](../tests/e2e/presenter.spec.ts). |
| <a id="r03"></a>R03 | Verified locally | Rental payment and current venue arrangement agreement are separate publication gates. [publication regression tests](../tests/unit/regressions.test.ts). |
| <a id="r04"></a>R04 | Verified locally | Explicit pairs only, including cross-walkway rejection; grouped pair choices. [inventory and keyboard component tests](../tests/components/booth-choice.test.tsx). |
| <a id="r05"></a>R05 | Verified locally | Draft/submitted/shortlisted applications create no agreement, hold or payment. [workflow guards and review shortlist browser check](../tests/unit/workflows.test.ts). |
| <a id="r06"></a>R06 | Verified locally | Up to three unique ranked alternatives; losing 23 preserves 24 and the same backup request. [complete competition browser journey](../tests/e2e/merchant.spec.ts). |
| <a id="r07"></a>R07 | Verified locally | Fixed business/edition application IDs; Paper submission changes seven to eight. [fixture and browser counts, correction without duplication](../tests/e2e/merchant.spec.ts). |
| <a id="r08"></a>R08 | Verified locally | Initial offers blocked before close; shortlist and clarification remain usable. [premature offer and requested correction checks](../tests/e2e/organizer.spec.ts). |
| <a id="r09"></a>R09 | Verified locally | One live offer per application, one claim per booth; replacement rollback is atomic. [conflict and failed-replacement domain tests](../tests/unit/extended-rules.test.ts). |
| <a id="r10"></a>R10 | Verified locally | 48-hour offer window, exact expiry boundary, feasible extension, acceptance retains deadline. [timing and schedule tests](../tests/e2e/timing.spec.ts). |
| <a id="r11"></a>R11 | Verified locally | Acceptance, sufficient verified initial receipt and valid allocation are all required. [deposit/full browser verification and domain guards](../tests/e2e/timing.spec.ts). |
| <a id="r12"></a>R12 | Verified locally | Correct recipient verifies; private rental, organizer rental and merchant totals remain separate. [main journey and cancellation accounting tests](../tests/unit/extended-rules.test.ts). |
| <a id="r13"></a>R13 | Verified locally | Disclosed deposit/full terms are snapshotted in the offer; balances use verified credit. [full-payment and partial-receipt browser scene](../tests/e2e/timing.spec.ts). |
| <a id="r14"></a>R14 | Verified locally | Timely unresolved proof retains the whole pair past expiry and shows follow-up. [overdue proof browser and unit checks](../tests/e2e/timing.spec.ts). |
| <a id="r15"></a>R15 | Verified locally | Partial/duplicate/unclear/late proof cannot double credit or steal allocation. [late reallocation browser case and receipt unit matrix](../tests/unit/workflows.test.ts). |
| <a id="r16"></a>R16 | Verified locally | Submission, arrangement and offer/quote snapshots survive profile, schedule, price and policy edits. [quote revision browser and immutable context tests](../tests/unit/extended-rules.test.ts). |
| <a id="r17"></a>R17 | Verified locally | Waitlist does not allocate; unpaid decline retains application; substitute requires exact acceptance. [waitlist substitute browser case and decline guard](../tests/e2e/presenter.spec.ts). |
| <a id="r18"></a>R18 | Verified locally | Request, decision, pair release, stopped collection and refund installments are separate. [cancellation browser and accounting tests](../tests/e2e/cancellation.spec.ts). |
| <a id="r19"></a>R19 | Verified locally | Five setup tabs preserve incomplete raw form drafts on exit/refresh; full save validates the step. [setup implementation and browser walkthrough](../src/features/events/event-setup.tsx). |
| <a id="r20"></a>R20 | Verified locally | Versioned packet distinguishes supplied/current/reviewed/change; only owning venue agrees. [packet browser and publication tests](../tests/e2e/organizer.spec.ts). |
| <a id="r21"></a>R21 | Verified locally | Material revision invalidates current agreement and pauses publication/new submissions. [material revision regressions](../tests/unit/regressions.test.ts). |
| <a id="r22"></a>R22 | Verified locally | Contextual messages and meeting counter/accept/decline/cancel do not imply agreement. [direct additional browser checks](../scripts/extra-check.mjs). |
| <a id="r23"></a>R23 | Verified locally | Publication validates complete identity, geometry, packet, agreement, access, terms and time. [publication and full/deposit feasibility tests](../src/domain/publication.ts). |
| <a id="r24"></a>R24 | Verified locally | Published event uses current dates and upcoming/open/closed window; publication creates no offers. [publication browser and scene guard checks](../tests/e2e/organizer.spec.ts). |
| <a id="r25"></a>R25 | Verified locally | Three fictional listings, capacity/area filters, no results, details and labeled illustrative prices. [visual matrix and direct filter check](../scripts/extra-check.mjs). |
| <a id="r26"></a>R26 | Verified locally | Requested date and inquiry fields survive refresh; received status explicitly reserves nothing. [date carry-through and inquiry recovery browser checks](../scripts/extra-check.mjs). |
| <a id="r27"></a>R27 | Verified locally | Whole-access quote hold has a separate 24-hour rule; overlap rejected with prior record retained. [venue conflict browser and full-access regression](../tests/e2e/venue.spec.ts). |
| <a id="r28"></a>R28 | Verified locally | Payer and venue see the same accepted quote, review status, confirmation and balance. [end-to-end venue receipt verification](../tests/e2e/venue.spec.ts). |
| <a id="r29"></a>R29 | Verified locally | Quote versions preserve earlier dates/price; accepted versions cannot be overwritten; cancellation/refund isolated. [quote revision browser and venue cancellation unit case](../tests/unit/extended-rules.test.ts). |
| <a id="r30"></a>R30 | Verified locally | Business, booth and review steps preserve work through errors, tabs, back and refresh. [draft recovery and direct-tab regression checks](../tests/e2e/merchant.spec.ts). |
| <a id="r31"></a>R31 | Verified locally | Profile edits do not rewrite submissions; requested after-close correction updates the same application. [profile and clarification browser workflows](../tests/e2e/organizer.spec.ts). |
| <a id="r32"></a>R32 | Verified locally | Map/list share selected/inventory state; keyboard pair selection and mobile contained scroll. [component test, browser parity and final screenshots](../tests/components/booth-choice.test.tsx). |
| <a id="r33"></a>R33 | Verified locally | Filters match detail, booth-based comparison, shortlist, private notes and clarification operate. [review filter and private note browser checks](../tests/e2e/organizer.spec.ts). |
| <a id="r34"></a>R34 | Verified locally | Shared agreement selectors drive state/deadline/history and role-specific next actions. [all three browser journeys and shared payment panel](../src/features/payments/payment-panel.tsx). |
| <a id="r35"></a>R35 | Verified locally | Confirmed-only roster includes contact, allocation, operating needs and verified/remaining amounts; print has all columns. [roster browser assertions and rendered print artifact](../src/features/payments/roster.tsx). |
| <a id="r36"></a>R36 | Verified locally | Exact twelve booths, ten pairs, eight businesses and separate rentals; deterministic clock/presets. [fixture consistency, all thirteen scenes and no future snapshots](../tests/unit/scenes.test.ts). |
| <a id="r37"></a>R37 | Verified locally | Role/identity/scene/time/reset, saved failure/recovery and latest-route continuation function. [presenter and persistence tests](../tests/e2e/presenter.spec.ts). |
| <a id="r38"></a>R38 | Verified locally | Public/merchant views exclude private packet, staff notes, rental balance and competitors; drafts remain private. [wrong perspective and organizer draft browser checks](../tests/e2e/presenter.spec.ts). |
| <a id="r39"></a>R39 | Verified locally | All nine families have working routes plus contextual empty/error/disabled/success states. [full browser suite and twelve-screen visual matrix](../scripts/final-visual-check.mjs). |
| <a id="r40"></a>R40 | Verified locally | One Next/React/TypeScript app with shared token/component system and limited documented packages. [locked manifest and passing production build](../package.json). |
| <a id="r41"></a>R41 | Verified locally | Three styled representative screens were checked before broad feature expansion. [retained T05 screenshots/results and execution record](../docs/evidence/t05-results.json). |
| <a id="r42"></a>R42 | Verified locally | Integer PHP amounts, explicit PHT summaries and fictional Davao areas; no endorsements/local factual claims. [fixture review and inspected rendered pages](../src/demo/fixtures.ts). |
| <a id="r43"></a>R43 | Verified locally | Six responsive widths, enlarged text, keyboard/focus, labeled states, axe and reduced motion checked. [final visual JSON, component and accessibility suite](../tests/e2e/accessibility.spec.ts). |
| <a id="r44"></a>R44 | Verified locally | Licensed/labeled local images, visible asset fallback, brief motion and measured lab LCP/CLS limits. [asset register and local performance/fallback report](../docs/evidence/final-visual-results.json). |
| <a id="r45"></a>R45 | Verified locally | No AI/provider integration, real data/payment/message/upload/account or unauthorized external action. [local code boundary and no external runtime requests](../docs/connected-demo-readiness.md). |
| <a id="r46"></a>R46 | Verified locally | A–J exercised through normal guarded actions, with exact named exception coverage. [scene matrix and full final browser log](../docs/evidence/final-browser.txt). |
| <a id="r47"></a>R47 | Verified locally | Run/recovery/testing instructions, actual outputs, implementation comparison and known limits delivered. [README and this evidence report](../README.md). |
| <a id="r48"></a>R48 | Verified locally | Supabase/Vercel adapter, membership, transactions, concurrency and deployment gates documented only. [reviewed T14 readiness document](../docs/connected-demo-readiness.md). |


## Scope limits and later stages

- Browser-local, single-origin fictional state; no authentication, trusted authorization, server database or concurrent-client guarantees. Local role/view restrictions are presentation boundaries, not security against inspecting localStorage. Opening several tabs is not a supported multi-user workflow.
- The fixed edition/inquiry fixtures drive this demonstration. Incomplete forms persist as raw drafts; Save and continue validates a step. Generalized multi-edition event creation, new venue resources and recurring bookings are not provided by the fixed-scene UI.
- After acceptance, proposed changes are recorded in the participant conversation for explicit discussion; the local demo does not silently execute a financial contract amendment or migrate receipts. Unaccepted quote/offer replacement is a distinct guarded version operation. Real amendment policy remains a later operating decision.
- Proof, verification, cancellation and refund are explicit simulations. No actual money moved or provider receipt authenticity was established. Packet previews are supplied sample text, not real file uploads. Exact venue-document requirements remain deferred.
- Firefox has a smoke check; full Firefox/WebKit/Safari, physical devices, full screen-reader testing, independent user testing and production field metrics are not claimed.
- Supabase and Vercel remain documentation-only. [T14 readiness](connected-demo-readiness.md) specifies authoritative server transactions, membership/RLS/privilege checks, concurrency tests and environment-specific deployment verification before connected/hosted claims.

No confirmed business rule or price was changed. Remaining live-pilot inputs are actual document examples, approved policies/payment instructions, real staff review commitments, identity/organization ownership, support, commercial validation and user acceptance.
