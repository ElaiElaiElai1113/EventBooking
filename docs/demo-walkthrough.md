# Davao event platform demo walkthrough

Status: Planning only. No complete application demo has been implemented.  
Related brief: [Demo scope v1](demo-v1-scope.md) and [validation plan](validation-and-demo-plan.md). The scope baseline identifies the required scenes; this document also retains optional later examples.

## Purpose and audience

Show potential venue owners, organizers, venue customers, and merchants how the platform connects their work. Each audience can follow its own journey; a guided presentation can switch roles to show both sides of the same request.

Use roughly 10 to 15 minutes for the combined demonstration, then let participants try relevant tasks. This is a presentation allowance, not a build estimate. Keep independent usability observations separate from tasks that were just explained to the participant.

The venue marketplace helps people find and inquire about venues. Venue staff manage the resulting booking. Organizers use an agreed venue and map to publish an event. Merchants apply for one booth or two adjacent booths, with the organizer making the final selection.

## Sample data

Everything below is fictional demonstration content. Prices and deposit percentages are illustrative and do not establish business pricing or organizer policy. No real messages, payments, or reservations are made.

| Record | Demonstration value |
| --- | --- |
| Venue listings | Sample Garden, Sample Hall, Sample Pavilion |
| Venue customer | Alex, planning a private celebration |
| Venue request | Alex's 80-guest celebration at Sample Hall on 7 November 2026, 10:00–18:00; access 09:00–19:00 including setup/cleanup |
| Sample venue quote | PHP 20,000 total; illustrative PHP 10,000 deposit; PHP 10,000 balance |
| Venue quote deadline | Issued 19 October, 10:00; expires 20 October, 10:00. This fictional venue-set 24-hour hold is separate from the merchant 48-hour offer rule. |
| Private booking balance due | 5 November 2026 at 18:00 |
| Organizer | Sample Market Team |
| Event | Sample Davao Makers Market at Sample Hall, on a different date from Alex's celebration |
| Organizer venue agreement | Separate sample rental: Sample Market Team pays Sample Hall; illustrative PHP 20,000 total, PHP 10,000 deposit, and PHP 10,000 balance |
| Merchant period | The full event edition; no per-day splitting in this demo |
| Booth inventory | 12 sample booths numbered 21 through 32 |
| Standard booth quote | PHP 2,000 total per booth; illustrative 50 percent deposit |
| Pair quote | PHP 4,000 total for two standard booths; illustrative PHP 2,000 deposit and PHP 2,000 balance |
| Confirmed merchant payment setting | Organizer chooses deposit with a remaining-balance deadline, or full payment upfront, per event; merchants see the terms before applying |
| Main walkthrough payment mode | Deposit mode with the illustrative values above and a displayed balance deadline before event setup |
| Full-payment variant | A separately resettable configuration of the sample event: PHP 4,000 required for the pair, PHP 0 balance after full receipt is verified |
| Confirmed review timing | Initial merchant booth offers after the application deadline |
| Confirmed offer period | Default 48 hours to accept and submit the required initial payment, whether deposit or full amount; organizer may grant an explicit extension |
| Confirmed event payment flow | Organizer pays venue; accepted merchants pay organizer; the receiving business verifies receipt |
| Confirmed cancellation/refund policy ownership | Organizer sets terms per event; merchants see them before applying and accept a preserved version with their booking |

## Simplified sample map

Use a fictional, simple layout for explaining the rules. It is separate from the operational layout in the user's reference image and is not a measured venue plan.

- Row A: Booths 21, 22, 23, 24, 25, 26.
- Row B: Booths 27, 28, 29, 30, 31, 32.
- A walkway separates the two rows. Booths across that walkway are not eligible pairs.
- The explicitly agreed eligible pairs are 21+22, 22+23, 23+24, 24+25, 25+26, 27+28, 28+29, 29+30, 30+31, and 31+32.
- Booths 26 and 27 are not adjacent despite consecutive numbering.
- Sample power availability is recorded for Booths 23, 24, 30, and 31. Do not infer it from an icon or booth number.
- Pair eligibility does not override event requirements, availability, or organizer approval.

Display the same inventory as both a map and a list so the merchant can inspect it on a phone without precise tapping.

## Merchant applications

In the merchant-entry scene, Paper and Clay is a draft and the other seven applications are already submitted. Submitting that draft produces the eight-application review scene; do not create a duplicate. A presenter may also jump directly to this same review state with eight submitted applications and no booth holds. Each applicant sees only its own proposal and status; the organizer can review the pool.

| Merchant | Category | Request | Preferences | Requirement or purpose |
| --- | --- | --- | --- | --- |
| Brew Corner | Coffee | One booth | 23, then 24 | Electricity; first competing applicant |
| Paper and Clay | Crafts | Two adjacent booths | 23+24, then 30+31 | Needs the pair; main merchant walkthrough |
| Sweet Tray | Pastries | One booth | 25, then 26 | Standard booth |
| Green Goods | Plants | One booth | 21, then 22 | Standard booth |
| Stitch Studio | Apparel | Two adjacent booths | 27+28, then 28+29 | Second pair example |
| Iced Sip | Coffee | One booth | 30, then 31 | Electricity; overlaps an alternative pair |
| Local Finds | Accessories | One booth | 28, then 29 | Overlaps a pair preference |
| Pantry Picks | Packaged food | One booth | 22, then 21 | Standard booth |

These preferences demonstrate competition, not a ranking of merchant quality. Do not add automatic scoring or automatic selection. If category limits are introduced later, specify whether they count merchants or booths before using them in decisions.

## Walkthrough one Customer and venue owner

1. Start as Alex. Browse the sample venues, compare capacity and package inclusions, and request a date at Sample Hall.
2. Show the customer message: inquiry received; availability and final terms require a response. No reservation has been made.
3. Switch to venue staff. Open the same inquiry, inspect the sample calendar, and prepare the PHP 20,000 quotation with the required payment, balance deadline, access interval, and venue-specific sample terms.
4. Send quote and hold space as one action after checking availability. Show the venue's explicit deadline. The hold covers 7 November, 09:00–19:00 including setup and cleanup. A second request may be recorded, but cannot create another exclusive hold for that time.
5. Return to Alex. Review the quotation and hold expiry, accept the terms, and simulate submitting the PHP 10,000 deposit reference.
6. Show payment pending verification. Switch to venue staff and simulate verification.
7. Show the confirmed booking on the venue calendar and the customer's confirmation page, including the PHP 10,000 remaining balance.

The audience should understand what an inquiry, hold, and confirmation mean, and which business receives and verifies the payment.

## Walkthrough two Organizer and venue agree on the event

1. Start as Sample Market Team. Show the event's separate venue agreement at Sample Hall, including the organizer as payer and venue as recipient. Simulate the organizer's PHP 10,000 rental deposit and venue staff verification against that agreement, leaving the illustrative PHP 10,000 balance. An organizer may also record an agreement reached outside the marketplace. Merchant booth payments will be separate receipts to the organizer.
2. Show event dates, the sample map, booth facts, eligible adjacent pairs, and operating rules. Show the organizer choosing deposit or full-payment terms; use deposit mode for the main story, with a remaining-balance deadline after initial offer deadlines and before event setup.
3. Switch to the venue view. Review the required information and supporting documents alongside the layout and event-use rules. Record review of the current packet, then explicitly agree to that version. If needed, exchange sample messages or propose a meeting within this event; neither messages nor meeting confirmation approves the arrangement. An optional branch requests equipment clarification, lets the organizer revise the packet, and requires renewed venue review. All communications, attachments, and appointments in the demo are fictional simulations.
4. Return to the organizer. Publish the event page with application dates, the expected decision date, booth prices, payment mode, initial-payment requirement, any balance deadline, cancellation/refund policy, and merchant requirements.
5. Open the public event page on a narrow mobile layout. Inspect Booth 23 and the 23+24 pair in both map and list views.

The venue agrees on the event, map, and rules. The organizer owns merchant selection. No individual merchant-approval task is shown in the venue view.

## Walkthrough three Merchant application and competing preferences

1. Start as Paper and Clay. Read the event terms and choose a request for two adjacent booths.
2. Attempt to select 26+27. Explain that these are across the walkway and show eligible alternatives.
3. Choose 23+24 as first preference and 30+31 as backup. Reuse the sample merchant profile, add event-specific details, and submit one application.
4. Show application submitted, no booth reserved, and the published decision date. Both preference pairs remain expressions of interest. No booth payment is requested before organizer acceptance.
5. Switch to the organizer. Review Brew Corner and Paper and Clay as competing applicants for Booth 23. Inspect requirements and source application details.
6. Under the confirmed review-after-deadline mode, show that sending an offer before the application deadline is unavailable. Advance the sample date beyond applications closing, then offer Booth 23 to Brew Corner; it becomes held.
7. Return to Paper and Clay's application. The 23+24 pair is unavailable because 23 is held. Booth 24 is not partially reserved for Paper and Clay.
8. Organizer chooses to offer the available 30+31 pair to Paper and Clay. Show both booths, two PHP 2,000 line items, PHP 4,000 total, and the illustrative PHP 2,000 deposit. Both booths become held under one offer.
9. Show that Iced Sip's application remains active but cannot receive a competing offer for 30 or 31 while this pair is held.
10. Return to Paper and Clay. Show that the organizer has accepted the application and offered the specific pair. Review the exact pair and terms, accept, and simulate a PHP 2,000 payment to Sample Market Team, identified as the recipient. Status becomes payment under review.
11. Switch to organizer staff and simulate verification. Confirm both booths together; show the merchant its pair, PHP 2,000 remaining balance with a due date, setup instructions, and organizer contact. The booking is confirmed but not yet fully paid.
12. Show the organizer roster with the same confirmed merchant and booth pair. Other applications remain traceable and retain their actual status. The merchant's PHP 2,000 receipt has not changed the separate PHP 10,000 venue-rental balance owed by Sample Market Team.

The audience should understand that merchants apply once, backups preserve that application, the organizer decides, and a two-booth booking is a single agreed pair.

## Optional exception scenes

Use separately resettable scenes so presenters do not accidentally alter the main walkthrough's records. Simulated time controls are for demonstration and do not establish production scheduling reliability.

| Scene | What to demonstrate |
| --- | --- |
| Declined pair offer | Both holds are released; organizer can review other candidates |
| Unpaid offer expires | Both booths are released together, with the old offer preserved in history |
| Organizer extends an active offer | Show the explicit new deadline on both sides; both booths in a pair remain under the same offer. A previously expired offer requires availability to be checked before renewal. |
| Proof submitted before the deadline | Show verification pending and then an overdue-review action item if staff miss the sample review target; do not silently reassign the pair |
| Full payment instead of deposit | Reset to the separate full-payment configuration before publishing any offers. Show PHP 4,000 required within 48 hours for the pair, then confirmation and PHP 0 balance after verification. Do not alter the accepted deposit terms in the main scene. |
| Partial payment in full-payment mode | A PHP 2,000 receipt against the PHP 4,000 requirement leaves PHP 2,000 required; the pair is not confirmed from that receipt alone. |
| Deposit paid but later balance overdue | Keep the distinction between confirmed booking and overdue balance visible. Show an organizer follow-up task under the accepted event policy rather than automatically releasing the pair; specific sample late-balance terms still need selection. |
| Payment after an expired offer | Show organizer review, without reclaiming a booth already allocated elsewhere |
| Single-booth alternative | Organizer offers one booth with a revised total; merchant explicitly accepts or declines the quantity change |
| No suitable pair remains | Show waitlisting, updated pair preferences, or withdrawal within the same application |
| Layout changes after acceptance | Show a proposed revision requiring organizer/venue discussion where applicable and affected merchant agreement |
| Confirmed merchant requests cancellation | Show the accepted policy and request. Release the full pair only after the organizer records confirmed cancellation; track any refund separately. |
| Event policy changes after booking | Show the existing booking's accepted policy version unchanged. Do not silently apply new refund terms. |

## Presenter controls and expectations

- Start or reset each journey using a known sample state.
- Switch among venue customer, venue staff, organizer, and merchant perspectives.
- Advance the sample clock for deadlines instead of waiting in real time.
- Label payment verification and notifications as simulated.
- Keep the same offer, amounts, booth pair, and status visible across roles.
- Offer a short role-specific route for prospects who only want to understand their part.
- Use one clear primary action at each step, with alternatives available without clutter.

No real accounts, external messages, payment-provider integrations, AI, or production data are needed to demonstrate these journeys. Role switching is presentation navigation, not a demonstration of secure authentication.

## Feedback to collect

After presenting, ask what would make the participant continue using their current method and what essential step is missing. For an independent usability task, use a fresh participant or an unfamiliar scenario and record whether they complete it without narration.

Capture whether each role understands when a venue or booth is actually confirmed, whether a merchant needs to submit again after a preference is taken, who approves merchants, what a pair request means, who receives the payment, and what happens next. Record specific objections and operational mismatches before changing the product scope.

This walkthrough is ready for discussion. Initial booth offers after the application deadline, a default 48-hour offer window with organizer extensions, direct payment responsibilities, deposit or full-payment choice, and organizer-defined cancellation/refund policies per event are agreed. Specific sample amounts, payment methods, policy examples, verification targets, reminder timing, and sample content remain proposed until agreed. The [screen outline](demo-screen-outline.md) is the next planning artifact to review. Implementation still requires a later user instruction to proceed.
