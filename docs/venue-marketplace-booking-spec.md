# Venue marketplace and customer booking

Status: Version 1 demo planning baseline, 20 September 2026. Proposed operating details for fictional sample journeys; no application implementation or customer validation is claimed.

Related: [Demo scope](demo-v1-scope.md), [screen map](demo-screen-outline.md), [walkthrough](demo-walkthrough.md), and [organizer event setup](organizer-event-setup-spec.md).

## Outcome and boundary

A customer can find a suitable venue, request their preferred date and arrangement, receive a clear quote, accept it, submit a sample payment to the venue, and understand when the venue confirms the booking. Venue staff see the same request, calendar hold, quote version, receipt, and balance.

Use an inquiry-and-quote flow for the first demo. It fits the existing plan's venue-led confirmation and lets the venue check event use, timing, requirements, and price before committing space. Instant booking would require reliable live availability and standardized terms that have not been established. A bare contact directory would not demonstrate the management experience. Neither is part of version 1.

The organizer may also use this venue-booking journey, then prepare an organizer-run event attached to the agreed rental. Venue confirmation does not approve the event's merchant layout automatically. Organizer-to-venue payments, private-customer-to-venue payments, and merchant-to-organizer payments remain separate records.

## Customer screen map

| Screen | Main content | Primary action | Result and return path |
| --- | --- | --- | --- |
| C1. Find a venue | Three fictional listings; location, suitable event uses, illustrative capacity, amenities, indicative price; simple location and guest-count filters | View venue | Open C2 while retaining browsing choices |
| C2. Venue details | Photos or clearly labeled sample imagery, capacity, spaces/inclusions, operating restrictions, indicative price, requested date/time | Request a quote | Open C3 with venue and requested date carried forward; back returns to C1 |
| C3. Booking inquiry | Contact, event purpose, guest count, preferred event times, setup/cleanup needs, selected package, additional requirements | Send inquiry | Open C4 with received status; no hold or payment is created |
| C4. Booking detail | Current status, venue response, exact quote, hold deadline, accepted terms, receipts, balance, and booking history | Changes with status: reply, review quote, submit payment reference, or view confirmation | Remain on the same booking record; return to a simple request list |

Do not hide basic suitability, price guidance, or terms behind account creation. The demo uses Alex's sample identity; real authentication is outside scope. Illustrative listing capacity and price are sample data, not verified claims about a real venue. A date search is an inquiry preference, not a guarantee that the space is available.

Before sending, summarize the requested date, event use, guest count, and access needs. A request with missing information stays a recoverable draft. Successful submission displays a reference and a next-step explanation: the venue will check the request; nothing is reserved yet. Do not invent a guaranteed response time.

## Venue staff workspace

Use one workspace with Requests and Calendar views plus a booking detail panel. The calendar shows the resource, access interval, and held/confirmed status; it does not contain merchants' booth allocations. For this demo, each venue has one bookable whole-venue resource. Separate rooms, combined rooms, recurring reservations, and multi-resource packages are deferred.

The booking detail has the customer's event needs and conversation on one side, and the quote/hold/payment actions in context. Staff can ask for missing information, propose another date, decline a request, or prepare a quote. A second inquiry for the same interval can be recorded without obtaining a second hold.

The quote contains: venue and resource, access start/end including setup and cleanup, package/inclusions, itemized price and total, required initial payment, remaining balance and deadline, cancellation/change terms, payment recipient and instructions, quote version, and the deadline for accepting and submitting the initial payment. Prices and payment amounts are explicit; accepting a quote is not accepting an undisclosed final bill.

For the main demo, Send quote and hold space is one staff action. It checks that the interval is free, then creates an exclusive temporary hold with a stated deadline. If it conflicts, show the conflicting interval and let staff propose another date. A draft quote or inquiry creates no hold.

The venue sets its quote/hold deadline. The merchant booth offer's confirmed 48-hour default does not automatically apply to venue rentals. Version 1 uses a fictional 24-hour venue hold only to make its sample expiry clear; this is not a universal venue policy.

## Booking states and payment meaning

| Situation | Customer-facing meaning | Inventory and next action |
| --- | --- | --- |
| Inquiry received | Awaiting venue response; no space reserved | No hold; venue reviews the request |
| More information needed | The venue has a specific question | No hold unless one was separately issued; customer replies in this booking |
| Quote and hold issued | Review this exact arrangement by the stated deadline | One temporary exclusive hold; customer reviews quote |
| Quote accepted | Terms accepted; initial payment is still required | Original hold/deadline continues; customer follows venue payment instructions |
| Timely payment proof submitted | Venue is checking the receipt | Retain hold during unresolved review; venue verifies actual receipt |
| Required initial payment verified | Booking confirmed under the accepted terms | Confirm the same resource and interval; show any balance and due date |
| Quote declined before acceptance/payment | This offer was declined | Release that hold; retain inquiry history for another proposal |
| Quote expires with no unresolved timely payment | This offer no longer holds the space | Release hold; a fresh quote needs another availability check |
| Confirmed booking cancellation requested | Request received, not yet canceled | Keep booking while venue reviews its accepted policy; cancellation and refund remain separate |

Timely proof is not payment verification. An unclear or partial receipt does not confirm a booking. If review runs past the hold's deadline, show a staff follow-up item instead of silently reallocating a potentially paid booking. The actual review target is still to be established with venues.

A payment after an expired hold enters venue review and must not reclaim a resource already held or booked elsewhere. If money or proof is already recorded, withdrawal goes through staff review rather than the simple unpaid-decline action. Confirmed cancellation releases inventory only after staff record the decision; any refund is tracked separately as due, paid in part, completed, or not due under the accepted terms. The platform does not send the refund.

Quote acceptance alone never confirms the booking or restarts the clock. Once the required initial payment is verified and the allocation remains valid, both the customer and venue see confirmation. A deposit-confirmed booking can still have a remaining balance. The platform records these states without receiving or splitting funds.

## Changes and conversations

Questions stay on the same booking record. Before acceptance, a changed date, package, or price requires a clearly revised quote and another availability check where relevant. Keep prior quotes in history and identify the active one. After acceptance or confirmation, show a proposed change requiring customer agreement; do not silently rewrite the agreed price, dates, terms, or receipt history.

The organizer-event setup already contains an optional meeting example. Version 1 does not add a second full scheduling system to customer bookings; a basic contextual conversation is enough to explain inquiry and quote clarification. Production messaging, reminders, calendars, and call integrations remain deferred.

## Fictional sample for Alex

All dates are in 2026 and all times are Asia/Manila. These values are demonstration fixtures, not actual offers or approved venue policies.

| Item | Sample value |
| --- | --- |
| Customer and venue | Alex; Sample Hall; private celebration |
| Inquiry | 19 October, 09:00; 80 guests |
| Quote and hold issued | 19 October, 10:00 |
| Quote/hold deadline | 20 October, 10:00 — 24 hours later |
| Quote accepted and payment submitted | 19 October, 11:00; PHP 10,000 to Sample Hall |
| Venue verifies receipt | 19 October, 12:00; booking becomes confirmed |
| Price and remaining balance | PHP 20,000 total; PHP 10,000 verified deposit; PHP 10,000 balance |
| Balance deadline | 5 November, 18:00 |
| Reserved access | 7 November, 09:00–19:00, including setup and cleanup |
| Celebration itself | 7 November, 10:00–18:00 |
| Separate organizer rental | Sample Market Team at Sample Hall, 13 November, 14:00 through 15 November, 22:00 |

The main path deliberately uses different dates for Alex and the market. A resettable conflict scene introduces a second inquiry for Alex's same access interval; it must not obtain a second exclusive hold. No real customer or venue receives a message or money.

Rental cancellation copy belongs to the venue's agreement and is separately labeled as illustrative. The selected example is recorded in [demo scope v1](demo-v1-scope.md); it does not inherit the organizer's merchant policy. Display that exact sample copy with the quote and preserve it on acceptance. Real venue terms and document requirements remain validation work; no universal refund percentages are established.

## Review criteria for this journey

1. A customer finds the sample venue, sends an inquiry, and understands that it is not a booking.
2. Venue staff can quote the complete access interval, place one hold, and see a conflict instead of a second hold.
3. Quote total, payment recipient, required initial amount, deadline, and remaining balance agree across both roles.
4. Acceptance without verified payment, or a partial receipt, does not show confirmation.
5. Timely proof pending review keeps the booking out of automatic reallocation; late payment triggers review.
6. Verified initial payment confirms the interval on both sides while any remaining balance stays visible.
7. Quote revision, cancellation, and refund status retain the accepted history and do not alter another rental or any merchant booth receipt.

These are future demo acceptance criteria. They do not establish production concurrency, payment authenticity, secure access, or calendar reliability.
