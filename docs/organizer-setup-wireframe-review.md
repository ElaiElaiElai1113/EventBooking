# Organizer setup wireframe review

Status: Interactive planning wireframe prepared and revised on 20 September 2026. Proposed design, not an implemented application or a validated business workflow. The user confirmed online review with the required information/documents and optional messages and meetings.

Related: [Event setup specification](organizer-event-setup-spec.md), [screen outline](demo-screen-outline.md), and [demo walkthrough](demo-walkthrough.md).

## What this review covers

The conversation contains a clickable wireframe of the five organizer setup steps, the scoped venue review, and the merchant-facing preview. It uses the existing fictional Sample Davao Makers Market and 12-booth layout. This is the event-setup portion of the larger demo, not the complete venue marketplace or merchant application experience.

The design uses a step list, a single current work area, and one main progression action. A compact review-perspective control sits outside the depicted application. On narrow screens the steps wrap and the content stacks; the map also has a list alternative. The optional design controls compare side navigation with top navigation without changing the workflow.

## Screens and transitions

| View | What to inspect | Main action |
| --- | --- | --- |
| 1. Event details | Identity, contact, event dates, setup and cleanup | Continue |
| 2. Venue and layout | Separate venue rental record, review version, booth map/list, pair eligibility, operating rules | Continue while review is pending |
| 3. Applications | Opening, deadline, expected decisions, standard form, proposed ranked backups | Continue |
| 4. Payments and policies | Deposit/full payment, paired-booth quote, recipient, cancellation sections | Continue |
| 5. Preview and publish | Readiness, current venue agreement, merchant preview | Simulate publication after agreement |
| Venue review | Event arrangement, access, map, operating rules, required packet, messages and optional meetings | Review the packet, then agree or request a specific change |
| Merchant preview | Event dates, application window, booth facts, price, payment and policy terms | Applications open on the stated date |

Save and exit returns to a sample draft entry. Resume retains the current choices within the wireframe. Role changes use the same sample state. These interactions do not demonstrate production storage, authentication, multi-user access, messages, payments, or inventory concurrency.

## Review paths

1. Move through the five organizer steps. In Payments and policies, compare deposit with full payment; the pair quote and merchant preview must change together.
2. Open Preview and publish before venue agreement. Publication must remain unavailable while the rest of the draft is accessible.
3. Switch to Venue and request power clarification. Return to the organizer's layout step and record the sample revision. The version changes to 2 and returns to pending review, rather than becoming automatically agreed.
4. Return to Venue, inspect the required sample packet and mark that version reviewed, agree to version 2, and return to the organizer. Publication becomes available for this prepared sample. Supplied information alone does not enable agreement before the review confirmation.
5. Simulate publication. The merchant page says applications open on 20 October; it does not reserve booths, send offers, or request payment. The fictional current date is 19 October 2026.
6. Inspect booths 23 and 26, then use the list view. Eligible pairs come from the defined map; 26 + 27 is never offered as a pair.
7. Save and exit, then resume. Restart example returns to the original pending-review state when comparing another scenario.
8. Open Messages and meetings from organizer or venue review. Add a sample message and switch roles to see the shared conversation. Propose a meeting; only the recipient can accept, suggest another time, or decline it. Either side can cancel the meeting. None of these actions changes venue agreement or reserves a booth.
9. Inspect the merchant preview: the private packet, conversation, and meeting controls are absent.

## Fixed sample content and unapproved assumptions

- Basic form fields are read-only sample values. The wireframe illustrates hierarchy and transitions; arbitrary form entry, field validation, image import, map editing, and a form builder are outside this artifact.
- Required documents are represented by three supplied sample information records with inline previews: venue terms, event brief, and layout/equipment plan. They are illustrative checklist items, not a universal legal-document list or actual uploaded files. A venue-only review checkbox belongs to the current version and resets when that version changes. This wireframe does not yet simulate arbitrary missing-file combinations or file upload.
- Messages use fixed example text. Meeting proposals use fictional 19 October 2026 times and sample online/in-person details. Proposal/acceptance/rescheduling/decline/cancellation are local planning interactions; no calendar, notification service, call link, or real conversation is created. Post-meeting outcomes remain part of the proposed workflow; this wireframe has no meeting-notes editor.
- The existing sample prices remain PHP 2,000 per booth, PHP 4,000 per pair, and a 50% deposit in deposit mode. These are not business pricing decisions.
- The sample booth dimensions of 2 × 2 metres and a revised 500 W power limit are fictional details to illustrate venue review. They do not describe the supplied real-world map or establish operating limits.
- To make policy placement reviewable, the wireframe includes clearly labeled illustrative text: full refund for merchant withdrawal by 10 November at 18:00 and none afterward; full refund for organizer cancellation; an accept-or-withdraw choice for date/venue changes; and a 24-hour follow-up period for a missed balance before an organizer cancellation decision. These examples are not user-approved policies, legal advice, or validated commercial terms. The 24-hour balance follow-up is also distinct from the separately proposed payment-verification target.
- Up to three ranked booth alternatives remains proposed. It is not a confirmed platform limit.
- Sample readiness assumes all fixed form values are complete. The interactive publication gate illustrates the current venue-review dependency, not a complete validation engine. Actual policy content and other publication checks still require review before a real event.
- Switching payment mode is locked after simulated publication to avoid changing the example's published terms silently. Restart is the presenter path for comparing modes. This is a wireframe simplification, not a newly agreed blanket prohibition on editing live-event terms.
- Application submission, competing merchant allocation, offer expiry, receipt verification, cancellation execution, and refunds belong to the next journey designs. The merchant application button is intentionally unavailable before the sample opening date.

## Questions to validate with prospects

Use one task at a time and record where people hesitate before explaining the answer:

- Can an organizer identify what is needed before publication and continue useful work while the venue responds?
- Can venue staff tell what they are agreeing to without expecting to approve merchants?
- Can a merchant explain whether applying reserves a booth, who receives payment, and when payment is due?
- Do the venue map, adjacent pairs, payment terms, and publication checklist match a recent real event?

These are research prompts, not evidence that the workflow has been validated. Review findings should determine revisions before the complete demo is implemented.
