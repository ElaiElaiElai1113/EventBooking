# Davao event platform demo screen outline

Status: Draft planning outline. No screens have been implemented.  
Related documents: [Product plan](validation-and-demo-plan.md) and [demo walkthrough](demo-walkthrough.md).

Visual and technical direction: [UI/UX and technology brief](uiux-and-technology-brief.md). React is required, with Supabase/Vercel selected as platform direction. The existing wireframe and spatial sketches define information/behavior; they are not the finished visual style. The first styled screens should cover venue discovery, merchant booth selection, and organizer review, then apply their shared patterns to the rest.

## Purpose

Give prospects a clear route through their own part of the platform, while allowing a presenter to show both sides of a booking or application. This outline organizes the agreed workflows into screens; it does not add new business rules or select visual styling.

## Demo entry and navigation

The demo start offers three guided journeys: book a venue, prepare an organizer event, and apply as a merchant. A separate presenter control switches between venue customer, venue staff, organizer, and merchant views using the same sample records. Reset and sample-time controls stay clearly identified as demo controls.

Public navigation distinguishes finding a venue from finding events to sell at. Venue staff manage venue bookings and event agreements. Organizers manage their events and merchant applications. Merchants manage their applications and confirmed participation. One person may occupy more than one role.

## Proposed screen inventory

| Screen or view | Audience | Essential information | Main action and result |
| --- | --- | --- | --- |
| Venue discovery and details | Venue customer or organizer seeking a venue | Location, capacity, photos, indicative packages, inclusions, restrictions, and requested dates | Request a quote; create an inquiry without reserving the venue |
| Customer booking status | Venue customer | Inquiry history, quote, terms, hold expiry, required payment, verifier status, balance, and confirmation | Show the action appropriate to the current step: review quote, accept terms, submit sample payment, or view confirmation |
| Venue booking workspace | Venue staff | Inquiries, a simple calendar, quotation details, holds, rental payments, and confirmed bookings | Review an inquiry, issue a quote, or verify a receipt using contextual actions |
| Event setup and venue agreement | Organizer, with a scoped venue review view | Event dates, venue agreement, map, booth facts, eligible adjacent pairs, venue rules, application dates, payment mode, balance deadline, and cancellation/refund terms | Organizer prepares the event; venue and organizer record map/rules agreement; organizer publishes when required details are present |
| Public event page and booth map | Merchant | Event details, selection process, closing and decision dates, booth prices and requirements, payment terms, cancellation/refund policy, and organizer contact | Start an application; map and list provide equivalent ways to inspect booth choices |
| Merchant application | Merchant | Reusable business details, product information, event requirements, one-booth or adjacent-pair choice, and ranked alternatives | Submit one application; show received status and decision date without requesting booth payment |
| Merchant application and booking status | Merchant | Application history, clarification requests, exact booth offer, 48-hour deadline, terms, required payment, verification status, balance deadline, and setup details | One current next action: respond, review offer, submit sample payment, view confirmation, or request a change |
| Organizer application workspace | Organizer | Application list, categories, requirements, competing preferences, map availability, offers, payment-review items, and change/cancellation requests | Review an applicant and offer a valid booth or pair after applications close; verify a payment or record a policy decision when relevant |
| Event roster | Organizer | Confirmed merchants, booth numbers, payment/balance status, setup requirements, and contact details | Review event readiness and a sample export or print view |

Treat these as views, not a requirement for nine unrelated dashboards. Keep list-to-detail navigation and a clear return path. An event's policy editor belongs in event setup; its accepted policy and refund progress belong in the existing application/booking detail.

The [organizer event setup specification](organizer-event-setup-spec.md) expands event setup into five proposed steps: event details, venue and layout, applications, payments and policies, then preview and publish. It defines draft saving, scoped venue review, field requirements, and publication checks without implementing the screens.

The [wireframe review](organizer-setup-wireframe-review.md) records the first clickable planning wireframe for those five steps, venue review, and merchant preview. Its interactions are simulations with fixed sample fields; the broader application demo is not implemented.

Within event setup and venue review, keep the required-information checklist, supporting files, messages, and optional meeting requests attached to the same event. The user confirmed online review when the required material is supplied, with discussion or meetings as needed. This does not add a separate messaging dashboard or a mandatory meeting stage. Private review material is absent from the public merchant preview; only explicit agreement to the current arrangement satisfies venue approval.

The [merchant application and selection specification](merchant-application-and-selection-spec.md) is the next proposed flow: three application steps, one application detail page, and the organizer review/offer workspace. It defines how ranked alternatives, competition, offers, and payment review fit together. The user deferred gathering the exact venue-document requirements while this planning continues.

The [venue marketplace specification](venue-marketplace-booking-spec.md) now details the customer and venue-staff booking journey. The [version 1 demo scope](demo-v1-scope.md) is the current scope baseline for all three journeys; earlier optional ideas remain outside it unless explicitly included there.

## Merchant and organizer screen map

These are states and subviews within the existing screen families, not additional independent dashboards. Keep the merchant's application as the return point through review, offer, payment, and confirmation.

| View | Layout and essential content | Primary action and next view |
| --- | --- | --- |
| M1. Event page | Event summary, deadline, map/list, booth facts, eligibility, prices and terms | Apply → M2; existing applicants return to M3 |
| M2a. Business information | Short step indicator; reusable business/contact fields; event-specific products, photos, operating needs | Continue → M2b; save preserves the draft |
| M2b. Booth preferences | Quantity selector; map/list; first choice and ordered backups; price/suitability detail | Continue → M2c; invalid pair stays here with preserved values |
| M2c. Review application | Business summary, quantity, ranked options, requirements, terms, decision date, no-payment explanation | Submit once → M3 |
| M3. Application and booking detail | Status and next action first; exact offer/payment when relevant; preferences and history below | Reply, review offer, submit payment reference, or view confirmed setup details in place |
| O1. Application review | Filtered applicant list; selected business detail; linked map; requirements and overlapping preferences | Approve and offer booth → O2 after closing; request information/waitlist/decline stay on the record |
| O2. Offer panel | Selected booth or complete pair, each price and total, availability, required payment, balance, terms, expiry | Send offer → O1, with a hold and the same offer visible in M3 |
| O3. Receipt review panel | Applicant/offer, amount due, submitted reference, verification result, remaining balance | Verify required receipt → confirmed M3 and event roster; unresolved receipt stays in review |
| O4. Event roster | Confirmed merchant, booth(s), setup needs, balance and due date; simple print view | Open the existing booking detail; no duplicate record |

M2a–M2c are three stages of one saved form. O2 and O3 open in the organizer review workspace. On mobile, a selected record takes the full content area with a clear return to the list. Avoid squeezing list, detail, and map into three narrow columns.

### Spatial sketch: booth preferences

```text
Apply to Sample Davao Makers Market       Step 2 of 3

Requested space:  ( ) One booth   (x) Two adjacent booths

[Map | List]                     Your ranked choices
21  22  23  24  25  26            1. 23 + 24     PHP 4,000
------- clear walkway -------    2. 30 + 31     PHP 4,000
27  28  29  30  31  32            [Add another preference]

Selected pair: location, dimensions, power, inclusions
These are alternatives within one application. No booth is reserved.

[Back]                                          [Continue]
```

On a phone, place the quantity choice, map/list, selected details, and ranked choices in that order. Controls to remove or reorder preferences stay beside the corresponding preference. Do not use dragging as the only way to rank them.

### Spatial sketch: organizer review

```text
Sample Davao Makers Market       Applications closed 5 Nov, 18:00

[Application list | Map]       [Status] [Category] [Space needed]

Applicants                    Paper and Clay
Brew Corner                   Crafts | Requests two adjacent booths
Paper and Clay [selected]      Products and operational requirements
...                           1. 23 + 24 — unavailable (23 held)
                              2. 30 + 31 — available

                              [Request information]
                              [Approve and offer booth]

                              History | Internal notes
```

The offer action opens O2, which repeats the actual allocation, price, payment requirement, and deadline before sending. No hold is created merely by viewing an applicant, highlighting a booth, or shortlisting.

### Spatial sketch: one merchant status page

```text
Your application              Sample Davao Makers Market

Booths 30 + 31 offered          Respond by 8 Nov, 18:00
Total PHP 4,000                 Initial payment PHP 2,000
Remaining PHP 2,000 due 11 Nov, 18:00   Payee: Sample Market Team

[Review offer]                 Terms and policy version

Your application | Questions and replies | Previous activity
```

After acceptance, replace the main action with payment instructions. After sample proof submission, show pending organizer verification. After verification, show confirmation and the remaining balance. Keep the same offer numbers and terms through each state. Do not show competing merchants' identities or internal notes here.

## Venue customer and staff screen map

Customer navigation is C1 Find a venue → C2 Venue details → C3 Inquiry → C4 Booking detail. The venue's Requests/Calendar workspace opens the same record to reply, quote and hold, or verify payment. The [venue booking specification](venue-marketplace-booking-spec.md) defines each screen, action, deadline, and outcome.

```text
Customer                         Venue staff
Find venue → View details
Send inquiry ------------------> Review needs and availability
                                 Send quote + timed hold
Review quote <------------------ Exact terms and deadline
Accept → Submit payment -------> Verify required initial receipt
Booking confirmed <------------ Confirm same resource and interval
```

The quote and payment stages reuse the customer's booking detail and the venue's selected request. The calendar is another view of the venue booking records, not an independent source of confirmation.

## Information that must stay consistent across screens

- The same venue quote and rental payment appear for the customer and venue staff.
- The organizer's venue payment is separate from merchant payments received by the organizer.
- The same booth inventory, agreed map version, and eligible pairs appear in event setup, the merchant map, and the organizer workspace.
- One adjacent pair is one offer with two booth line items, one total, one deadline, and joint allocation.
- Application submission does not reserve inventory. Initial booth offers cannot be sent before applications close.
- Merchant acceptance and required payment verification precede booking confirmation. A confirmed deposit booking may still have an outstanding balance.
- Payment and cancellation/refund terms appear before application and again on the offer. Accepted versions remain attached to the booking.
- A cancellation request, confirmed cancellation, and completed refund are distinct outcomes.
- Venue staff do not approve individual merchants. Only organizer views contain merchant-selection actions.

## Essential states to include in the outline

Use the same screens for the normal and exception states: no available preferred booth; an invalid adjacent pair; a competing hold; missing application information; offer not yet allowed; offer expired; payment pending verification; confirmed with a balance; fully paid; waitlisted; cancellation requested; canceled with refund unresolved.

Give each state a plain explanation and a relevant next action. Do not rely on color alone to communicate availability or payment status. Preserve entered application information when a preferred booth becomes unavailable, and provide a list alternative to precise map tapping on mobile.

## Review before visual design

Check that each prospect can identify where to start, who must act next, whether space is merely requested or confirmed, who receives the money, and where to find accepted terms. Check the adjacent-pair and cancellation examples using the existing walkthrough.

Event setup has a clickable planning wireframe. Merchant/organizer and venue/customer screens now have explicit maps and spatial sketches, and all three journeys are bounded by the version 1 scope. These maps are design documents, not additional implemented screens. Exact venue-document requirements are deferred; sample policies, payment methods, and reminder/review targets remain assumptions to validate.
