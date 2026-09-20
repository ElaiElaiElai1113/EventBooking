# Organizer event setup specification

Status: Proposed product and demo design for review. Planning only; no implementation.  
References: [Product plan](validation-and-demo-plan.md), [screen outline](demo-screen-outline.md), and [demo walkthrough](demo-walkthrough.md).

## Outcome and scope

An organizer can prepare an event, agree on the venue layout and operating rules, configure merchant applications and commercial terms, preview the result, and publish a page that merchants can understand. This specification covers event setup and its scoped venue-review view. Merchant application review, booth offers, payment verification, and refunds use the later workspaces already outlined in the product plan.

The five-step layout, exact field grouping, draft behavior, review controls, and validation messages below are recommendations for the first demo. They preserve the agreed product rules: organizer-only merchant selection, one booth or two adjacent booths, initial offers after applications close, a default 48-hour offer window with organizer extensions, direct payments, organizer-selected deposit or full payment, and organizer-defined event cancellation/refund policies.

## Five-step flow

| Step | Name | Outcome | Primary action |
| --- | --- | --- | --- |
| 1 | Event details | A named draft with dates, organizer identity, and a merchant-facing description | Save and continue |
| 2 | Venue and layout | Venue use, booth inventory, eligible pairs, and rules are prepared for agreement | Continue; request venue review when this section is ready |
| 3 | Applications | Merchants know who may apply, what to submit, and when decisions are expected | Save and continue |
| 4 | Payments and policies | Merchants can read the required payment and cancellation/refund terms before applying | Save and continue |
| 5 | Preview and publish | Organizer sees the public page, unresolved items, and readiness to publish | Publish event, or go to the first unresolved item |

Show a compact progress indicator, event name, draft-save status, and a return to the event list. On mobile, show the current step and accessible step navigation without compressing all five full labels into one row. Keep a persistent save-and-exit option. Drafting can continue while venue review is pending; only publication is gated by that agreement.

## Draft and correction behavior

- Require only an event name to create a draft. Other fields become mandatory for the relevant review or publication checkpoint.
- Preserve entered values when moving between steps, changing payment mode, or correcting an error. Hidden draft values are not applied when their mode is inactive.
- In the proposed demo, save draft changes in the sample session and show an accurate save indicator. Do not imply production storage or cross-device recovery.
- Let organizers return to completed steps. Present errors next to the relevant field and in a short linked summary.
- Use Philippine time consistently. Show currency in PHP and unambiguous date/time labels.
- Place conditional or less common fields in context, such as power restrictions under booth details and balance deadlines under deposit payments.

## Step 1 Event details

| Field group | Fields | Publication requirement |
| --- | --- | --- |
| Identity | Event name; organizer business name and responsible contact | Required |
| Merchant-facing description | Event type, short description, intended products or audience | Required; enough to explain the opportunity without claiming guaranteed attendance or sales |
| Event schedule | Opening and closing date/time for the event edition | Required; end must follow start |
| Operational schedule | Merchant setup window and cleanup end | Required for the demo's venue agreement; these must fit within agreed venue access |
| Event image | Cover photo or graphic | Optional; allow a clean fallback |

Use one event edition spanning one or more dates. A booth allocation covers that full edition in the proposed demo. Do not introduce per-day booth bookings in this setup flow.

## Step 2 Venue and layout

### Venue agreement

Select a listed venue or record an existing privately arranged venue. Both paths capture the venue name, address, responsible venue contact, agreed access period, and event-use restrictions. Link or record the venue agreement and its rental payment obligations with the organizer as payer and the venue as recipient.

Keep rental payment status visible but separate from merchant booth receipts. Publication requires an agreed venue arrangement and any prerequisites recorded in that agreement; do not impose an invented rule that the entire rental must always be paid before applications open.

### Map and booth records

Recommend a prepared image with numbered booth markers and a synchronized booth list. For the first demo, use the existing fictional 12-booth map with prelinked markers. Demonstrate editing booth facts and eligible pair relationships. Arbitrary-image import, automatic booth recognition, wall drawing, and a free-form floor-plan editor are outside this first demo.

The broader product can accept an organizer-supplied layout image through a later scoped import workflow. The sample-map control must say "Use sample layout" so the demonstration does not imply that arbitrary images have already been converted into operational inventory.

| Booth information | Behavior |
| --- | --- |
| Unique booth number | Required and consistent between map, list, offers, and roster |
| Size and location | Organizer-supplied dimensions and position/zone; do not infer measurements from the image |
| Rental price and inclusions | Required price for each available booth, with clear inclusions and extra requirements |
| Suitability | Relevant restrictions such as power availability, equipment limits, or permitted use |
| Application availability | Mark usable booths or unavailable areas before publication |
| Eligible neighboring pairs | Explicitly identify physically adjacent pairs within the agreed map; consecutive numbers alone do not qualify |

Allow shared booth facts to be entered once and applied to selected booths, then edited where they differ. Clicking a marker focuses the corresponding booth record; selecting a row highlights its marker. Provide a readable list view on mobile.

The demo supports one-booth and two-adjacent-booth requests. An event may have only a subset of booths eligible for pairing. Pair eligibility means a merchant can request that pair; it does not reserve it or remove organizer discretion. The first demo uses the sum of the two booth prices as the pair total; special pair discounts are outside this specification.

### Venue review without blocking other setup

The user confirmed online venue review when the required documents and information are supplied, with messages and meeting arrangements available when needed. When event dates, access times, venue use, map, booth sizes/positions, eligible pair relationships, operating rules, and the specified supporting items are supplied, the organizer can request formal venue review. While waiting, they can finish application and merchant payment/policy settings. Incomplete drafts can still be discussed through messages or meetings.

The venue review view shows the event-specific venue agreement, map, access schedule, operating constraints, and supporting information. Its two decision actions are agree to the arrangement or request a specific change. Supporting actions open the event's messages and meeting requests. It contains no individual merchant applications or merchant-approval controls. Record the agreed version and review history.

For this demo, the presenter switches to the venue role to simulate the review; no real invitation or message is sent. Recording an existing off-platform agreement can be represented as an explicitly labeled sample case, not as a forged venue approval.

Changes to dates, footprint, booth positions or sizes, pair relationships, or venue operating rules after agreement require the affected version to be reviewed again before publication. Editing the event description or organizer's merchant pricing does not by itself reopen venue review unless it changes the venue agreement. Merchant selection remains the organizer's responsibility throughout.

### Required information and supporting documents

Recommend a venue-defined checklist for each event, initialized from that venue's usual requirements and adjusted for the event. The exact document types still need examples from venue contacts; do not invent a universal permit or identity-document requirement.

| Suggested checklist group | Usual provider | Review purpose |
| --- | --- | --- |
| Event brief and responsible contact | Organizer | Purpose, products/activities, dates, setup and cleanup, expected event needs |
| Proposed layout and equipment plan | Organizer, using the venue's site information | Booth positions, dimensions, adjacent pairs, circulation and equipment/power requirements |
| Venue information and operating terms | Venue | Space/access details, facilities, restrictions, rental agreement and its prerequisites |
| Other items specifically requested for this event | Named responsible party | Only the additional information the venue actually needs to decide |

Each item records its owner, required/optional status, current version, and supplied/reviewed/changes-needed state. Structured information already entered in the event can satisfy an item; do not make people upload the same details again as a document. A file being supplied does not imply the venue has reviewed it. The venue explicitly confirms review of the current required packet before agreement. Missing required items and unresolved required changes block agreement and publication, while drafting and coordination remain available. If an item does not apply, the venue records that decision rather than leaving an unexplained gap.

Supporting files and the venue-organizer discussion are private to authorized event participants. The public merchant page contains the agreed rules and application terms relevant to merchants, not internal files or conversations. The demo represents sample attachments and inline previews; real file storage, scanning, and permissions are later implementation work.

### Messages and optional meetings

Keep one venue-organizer conversation attached to the event and its review packet. Either party can ask a question, refer to a specific checklist item or version, and reply without starting another application or event record. An ordinary message is not formal agreement; if it requests a required change, record that as a review action so its status is visible.

Recommend a lightweight meeting request within the same conversation: purpose/agenda, proposed date and time in Asia/Manila, duration, participants, and online or in-person location details. The recipient can accept, suggest another time, or decline; either party can cancel a proposal or confirmed meeting. A proposed time is not a confirmed appointment. A rescheduled time needs acceptance again. A declined or canceled meeting does not cancel the event.

After a meeting, record the outcome in the event conversation and update the affected information or map version. Meeting acceptance, attendance, completion, and informal messages never approve an event automatically. The venue must still agree to the current arrangement. A meeting itself is optional, so an unrelated pending meeting does not block an otherwise complete agreement.

For the first demo, use local sample messages and meeting proposals with role switching. Calendar synchronization, email/SMS delivery, live chat infrastructure, and built-in video calls are outside the demo scope. In the wireframe, the meeting example uses fixed fictional times and sample online/in-person details; it does not book a real calendar or generate a call link.

## Step 3 Applications

| Field group | Settings | Behavior |
| --- | --- | --- |
| Application window | Opening date/time and closing date/time | Opening precedes closing; the public page explains whether applications are upcoming, open, or closed |
| Decision timing | Expected initial decision date/time | Must follow applications closing; organizer may inspect and request clarification earlier but cannot send initial booth offers early |
| Merchant fit | Permitted product categories and a short explanation of selection criteria | Show before application; do not introduce automatic scoring or first-come allocation |
| Application information | Business name, contact, products, photos where useful, booth quantity, preferences, and operational requirements | Use a standard form for the first demo; a general form builder is deferred |
| Booth preferences | One booth or an eligible pair, with proposed support for up to three ranked alternatives | Explain that alternatives are backups within one application; the maximum preference count remains a demo recommendation |
| Clarifications | Event contact and an application-specific question/reply history | Keep replies on the existing application; simulated messages only |

Display the confirmed rules as plain explanatory text, rather than switches organizers can accidentally disable: merchant selection belongs to the organizer, two booths must be adjacent, and initial offers start after the application deadline. Do not add a toggle for rolling acceptance in this demo.

## Step 4 Payments and policies

### Payment requirement

Show the organizer as the merchant's payment recipient. The organizer chooses one event-level payment mode:

| Mode | Visible setup fields | Merchant offer |
| --- | --- | --- |
| Deposit | Deposit rule and remaining-balance deadline | Total price, initial amount due within the 48-hour offer window, remaining amount, and balance deadline |
| Full payment upfront | No deposit or later-balance fields | Full offered amount due within the 48-hour offer window |

For a concrete first-demo control, recommend a deposit percentage of the combined offer total, using 50 percent only as illustrative data. This input representation is proposed; no universal percentage is imposed. Percentage values must represent an actual partial payment. Fixed-peso deposits can be scoped separately if organizer interviews show they are needed.

Display the default 48-hour offer period as agreed behavior. Per-offer extensions are managed later in the organizer workspace, with a visible new deadline. They do not require changing the entire event's payment mode.

Configure sample direct-payment instructions without real account details. Payment-method integrations are not part of this demo. Payment proof or a reference starts organizer verification; it does not itself complete the booking. The proposed 24-hour verification target is still an assumption and is not presented as an agreed service guarantee.

### Cancellation and refund policy

Provide three focused organizer-authored sections: merchant withdrawal, organizer cancellation or rescheduling, and missed balance deadlines. Present a short merchant-facing policy summary with the complete terms available. These are event-specific terms, not platform-generated legal wording or universal refund percentages.

Before applying, merchants can read the policy. The specific offer repeats the applicable terms, and acceptance preserves that version. Subsequent policy edits do not silently modify existing bookings. Venue-rental cancellation terms remain in the venue-organizer agreement and do not automatically determine merchant refunds.

The first demo requires policy content to be present but does not claim to assess legal validity. Specific sample wording remains a content-review item, separate from these confirmed policy ownership rules.

## Step 5 Preview and publish

Show a merchant-facing preview with event details, map/list, application schedule, selection process, prices, payment requirements, cancellation/refund terms, and organizer contact. Give the organizer a direct link back to each section that needs correction. The venue agreement and organizer rental balance are internal; do not expose them on the public merchant page.

| Publication check | Example correction message |
| --- | --- |
| Organizer identity/contact and event details are complete | Add the contact merchants should use for this event. |
| Venue use, layout, access schedule, and rules are agreed for the current version | The venue has requested a layout change. Review it before publishing. |
| Required supporting items have been supplied and reviewed for that agreement | The venue still needs the equipment plan. Supply it and request review. |
| At least one booth is open to applications and booth identifiers are unique | Booth 24 appears twice. Give each booth a unique number. |
| Active booth facts and eligible pairs are complete and internally consistent | Review the pair 26 + 27; it crosses the walkway in this sample layout. |
| Application opening, closing, and decision times are ordered correctly | Set the decision time after applications close. |
| Initial offer and payment schedule is feasible | Allow the full 48-hour offer window before the balance deadline and event readiness cutoff. |
| Deposit mode has a valid deposit rule and balance deadline | Add the date the remaining balance must be paid. |
| The organizer's payment instructions and policy sections are present | Add your event cancellation and refund terms. |

Only publish when blocking issues are resolved. Optional cover imagery does not block publication. The publication state is independent of application availability: a published event with a future application opening time shows "Applications open on [date]" until that time. Publishing does not issue offers, reserve merchant booths, or collect payments.

Proposed event-setup states are draft, awaiting venue agreement, changes requested, ready to publish, and published. Readiness is derived from the current fields and agreed version. The published event separately reports applications upcoming, open, or closed. These labels do not replace merchant application, offer, or payment statuses.

## Sample schedule for the demonstration

All times below are fictional and in Asia/Manila. They make the sequence concrete; they are not a real event commitment.

| Milestone | Sample date and time |
| --- | --- |
| Applications open | 20 October 2026 at 09:00 |
| Applications close | 5 November 2026 at 18:00 |
| Initial decisions and first sample offers | 6 November 2026 at 18:00 |
| First sample offers expire | 8 November 2026 at 18:00 |
| Deposit-mode remaining balance due | 11 November 2026 at 18:00 |
| Merchant setup begins | 13 November 2026 at 14:00 |
| Public event begins | 14 November 2026 at 10:00 |
| Public event ends | 15 November 2026 at 20:00 |
| Cleanup ends | 15 November 2026 at 22:00 |

The venue access period must cover setup through cleanup. Validate feasibility again when later offers or extensions are issued; the sample's first-offer schedule does not guarantee that an offer sent days later will fit. A timing conflict requires an explicit policy/offer revision rather than silently reducing the agreed 48-hour period.

## Event setup demo review cases

1. Organizer creates an incomplete draft, leaves, and returns with the entered sample-session values preserved.
2. Organizer requests venue review, then finishes application and payment settings while review remains pending.
3. Venue requests a map change. Publication remains unavailable until the relevant version is agreed.
4. Organizer links eligible adjacent booths while an invalid cross-walkway pair is identified for correction.
5. Organizer switches between deposit and full payment; only the selected mode's fields affect the preview and publication checks.
6. A decision date before applications close or an impossible 48-hour payment schedule is shown with a specific correction.
7. Merchant preview displays the event's payment and refund terms before the application action.
8. Organizer publishes a complete agreed draft; the event page appears in the correct application-window state without creating offers or payments.
9. Venue inspects the supplied sample packet and records review. A revised version requires review again before agreement.
10. Organizer and venue exchange sample messages and propose, accept, suggest another time for, or cancel a meeting. These actions do not approve the event, expose the discussion publicly, or create real messages/calendar entries.

## Next review

The user agreed to continue into wireframing. A clickable planning wireframe now illustrates the five steps, scoped venue review, and merchant preview in the conversation; its scope, review paths, and unapproved sample assumptions are recorded in the [wireframe review](organizer-setup-wireframe-review.md). Review the flow and gather feedback before implementing the complete demo. No application implementation, real venue outreach, payment configuration, or publication has occurred.
