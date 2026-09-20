# UI/UX and technology direction

Date: 20 September 2026. Status: Planning direction updated from the user's instructions. React is required; Supabase and Vercel are the selected backend and hosting direction. The proposed visual treatment and supporting libraries below guide the implementation plan. No packages, cloud projects, services, or deployments have been created by this document.

Related: [Demo scope v1](demo-v1-scope.md), [screen map](demo-screen-outline.md), and [validation plan](validation-and-demo-plan.md).

Handoff update: the [project master](../PROJECT_MASTER.md) and [implementation plan](superpowers/plans/2026-09-20-demo-v1-implementation.md) now incorporate this brief. The plan is written; application implementation remains for the next chat.

## Design objective

Create a recognizable, cohesive product that venue customers, owners, organizers, and merchants in Davao City can understand and use comfortably. The user explicitly wants a polished interface that does not look assembled from generic generated templates. Treat typography, content, navigation, interaction states, mobile behavior, and performance as part of the design, not a final decoration pass.

Local relevance comes from accurate venue information, understandable terms, suitable location details, and observations from actual prospects. No interviews have established a single preferred language, device, visual style, or connection quality for all Davao users. The local choices below are practical design hypotheses, not demographic findings.

## Technology choices

| Layer | Direction | Role and boundary |
| --- | --- | --- |
| Interface | React with TypeScript; recommend Next.js App Router | One React application for the public marketplace and operational workspaces, with clear routes and layouts |
| Styling | Tailwind CSS with a product-owned token system | Consistent typography, colors, spacing, radii, responsive behavior, and focus states |
| Accessible controls | Selected shadcn/ui components using one consistent primitive family, proposed Radix | Forms, dialogs, menus, tabs, and disclosure behavior; customize their appearance and composition |
| Forms | React Hook Form and Zod | Preserve entered values, validate meaningful fields, show specific errors, and share validation rules where appropriate |
| Motion | Motion for React, with CSS transitions for simple states | Animate a few useful state changes; do not introduce a second animation runtime by default |
| Icons | Lucide React | One consistent icon language; text labels on important actions |
| Backend | Supabase | Planned Postgres data layer, with Auth and Storage when their connected scope is implemented |
| Hosting | Vercel | Selected destination for preview and eventual production deployments; deployment is a later action |
| Quality checks | Playwright, targeted component/domain checks, and an accessibility checker such as axe-core | Verify the agreed journeys and visual/accessibility behavior; do not treat automated checks as full usability validation |

React's official setup guidance includes Next.js App Router as a React framework. The recommendation fits a product with public venue/event pages and interactive private workspaces; it is an architectural choice, not a claim that other React setups cannot work. [React guidance](https://react.dev/learn/creating-a-react-app), [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs).

shadcn/ui provides editable component source; its defaults do not define this product's brand. Use Tailwind theme variables to apply the same product tokens across both imported and custom components. Radix supplies interaction primitives, but the assembled product still needs accessibility checks. [shadcn/ui](https://ui.shadcn.com/docs), [Tailwind themes](https://tailwindcss.com/docs/theme), [Radix primitives](https://www.radix-ui.com/primitives/docs/overview/introduction).

The chosen form and animation tools have documented React integration. Use the current compatible packages at implementation time and retain the lockfile; do not pin version numbers in this planning document from memory. Import only the icons and animation features actually needed. [Form integration](https://ui.shadcn.com/docs/forms/react-hook-form), [Motion for React](https://motion.dev/docs/react), [Lucide React](https://lucide.dev/guide/react).

## How Supabase and Vercel fit the demo

Supabase is the backend direction, and Vercel is the hosting direction. Keep those choices in the implementation plan. The first React UI review can run against the existing fictional fixtures so visual and workflow review do not depend on credentials or a shared live dataset. Isolate demo data access behind a small application-data interface, allowing a Supabase-backed implementation without rewriting the screens.

The connected stage should use a dedicated development/demo project and fictional records. Configure actual user/organization/event relationships and server-enforced access before exposing private applications, venue documents, or receipts. A presenter role picker is never a security mechanism. Supabase's Next.js guide covers Database, Auth, Storage, and row access; the final access rules must reflect this project's distinct venue, organizer, customer, and merchant responsibilities. [Supabase Next.js guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs).

Use publishable client configuration only where appropriate. Secret/service-role credentials remain server-side. For exposed data, check table privileges as well as row-level policies; do not grant broad access merely to make a screen work. Keep offer/allocation/payment rules outside visual components, and enforce shared inventory constraints on the server when moving beyond the local simulation. The Supabase changelog was checked for planning; recheck the current changelog and SDK/runtime requirements before integration. [Supabase changelog](https://supabase.com/changelog).

Vercel preview deployment is the planned review destination once the application exists and local checks pass. Use isolated demo data, identify the environment, and verify the deployed revision and behavior. Selecting Vercel here does not mean a site has been published. Real payments, external messages, public uploads, and production operation remain outside the version 1 demo scope.

## Visual direction

| Direction considered | Fit | Decision |
| --- | --- | --- |
| Warm, photography-led marketplace with practical workspaces | Welcoming for venue discovery; enough structure for event operations | Recommended starting direction |
| Luxury hospitality style throughout | Could suit premium venue presentation, but overemphasizes luxury for varied event and merchant use | Keep only restrained editorial typography where it helps |
| Bright festival style throughout | Could communicate event energy, but competes with dense operational information | Use energy in event photography/content, not every control |

The proposed identity combines warm neutral surfaces, deep green text/actions, a restrained clay accent, clear typography, and venue imagery. This is a starting design direction, not a claim that these colors represent all Davao residents. Keep both marketplace and workspaces visibly part of the same product while adjusting density to the task.

### Starting tokens

| Token | Proposed value and use |
| --- | --- |
| Page background | Warm neutral `#F7F6F1` |
| Main content surface | `#FFFFFF` |
| Primary text/action | Deep green `#23352B`; white text on filled primary actions |
| Secondary text | `#5B665E` on the specified light surfaces |
| Accent | Clay `#A84C32`, used sparingly for emphasis; not a replacement for status labels |
| Structural divider | `#D7DDD6`; decorative separators only, not the sole boundary for essential controls |
| Essential control boundary | `#7C877E` on light surfaces; pair with labels and a visible focus treatment |
| Type | Fraunces for selected public-page headings; DM Sans for body text, navigation, forms, tables, and operational headings |
| Type scale | Body and editable fields 16px; secondary text 14px; operational headings about 24–32px; public headline scales about 32–52px |
| Space | A shared 4px base with 8/12/16/24/32/48px steps; 16–20px mobile outer padding |
| Shape | Approximately 8px controls and 12px content surfaces; status chips use a consistent compact shape |

Font candidates: [Fraunces](https://fonts.google.com/specimen/Fraunces), [DM Sans](https://fonts.google.com/specimen/DM+Sans). Limit weights and load only required font files. Keep readable system fallbacks. The first demo uses a light visual direction; a second complete theme is not required to prove the workflows.

Color values must be checked in their actual combinations. Statuses such as held, under review, confirmed, unavailable, and overdue always include text and, where useful, a distinct icon or pattern. The same accent must not mean success on one page and an unresolved action on another.

### Composition rules

- Public discovery begins with a concise purpose, useful search/filter controls, and attractive venue information. Keep listing choices visible without a long decorative introduction.
- Venue photography, accurate captions, and clear price/location information provide identity. Use consistent image ratios and intentional crops; preserve room/layout details that help customers judge suitability.
- Operational pages begin with the current event or booking, relevant status, and one main next action. Use open rows, section spacing, and dividers where they are clearer than repeated cards.
- Offer and payment panels emphasize exact booth(s), total, amount due, recipient, and deadline together. A decorative highlight must never separate the price from its terms.
- Build product components such as VenueListing, BoothChoice, OfferSummary, BookingStatus, PaymentRecord, and ReviewPanel around shared primitives. Give them defined loading, empty, error, unavailable, and completed states.
- Preserve one icon set, button hierarchy, form spacing, and status vocabulary across roles. Imported examples must be restyled and simplified to match this system before use.
- Keep the existing wireframe's information and business rules; its plain placeholder presentation is not the finished visual identity.

## Davao-focused usability

1. Show Davao City context, area/address, useful landmarks, and access instructions where they help choose or reach a venue. Validate actual names, locations, parking/loading, and accessibility details before presenting real listings.
2. Display amounts in PHP with clear totals and balance obligations. Use explicit Philippine dates and times; separate customer venue holds from merchant offer deadlines.
3. Start with clear English labels such as Find a venue, Apply for a booth, and Pay to the organizer. Validate whether Cebuano/Bisaya or Filipino support is wanted; a multilingual switch is not added to version 1 without actual translated content and review.
4. Use customer-facing Application/Apply language to explain the merchant proposal process. State that applying does not reserve a booth. Show why a pair is unavailable and what the merchant can do next.
5. Support touch use and smaller screens throughout all roles. This is a design priority to test, not a claim that every local prospect uses the same device.
6. Keep a readable list alternative to the floor plan. Numeric booth labels, operating requirements, and adjacent-pair relationships must remain usable without precise tapping or color interpretation.
7. Preserve application and booking work when a user goes back, corrects an error, or retries a failed save. Show whether a change is saved, pending, or failed; do not imply persistence the implementation does not provide.
8. Test slower connections and limited CPU as resilience cases. Browsing and forms remain usable while nonessential imagery or motion loads. Do not infer that these conditions describe every Davao user.

Do not add local stereotypes, invented testimonials, fake partner logos, unsupported venue verification badges, or foreign venue photos presented as Davao properties. Real venue content should come from owners or other authorized sources. Fictional demonstration imagery remains visibly illustrative.

## Motion specification

Motion should explain an interaction, preserve orientation, or add a small amount of polish. Select a single animation approach for each behavior.

| Interaction | Proposed treatment | Required behavior |
| --- | --- | --- |
| Button/field hover, focus, pressed state | CSS color/border/opacity change, roughly 120–160ms | Immediate input response and visible keyboard focus |
| Offer/detail panel opening | Short fade and small displacement, roughly 180–220ms | Correct focus entry/return; content and action available promptly |
| Changing form steps | Brief content transition, roughly 160–200ms | Preserve values, move focus to the new step heading, announce relevant errors |
| Selecting booth or pair | Immediate selected style with a short highlight transition | Update selection text and totals together; do not suggest a hold before an offer is sent |
| Reordering preferences | Small layout transition, roughly 180–220ms | Up/down controls remain available; dragging is optional |
| Verified success | Quiet state transition and short acknowledgment | Success follows the actual simulated/verified state change, not the animation timer |
| Public venue imagery | At most a restrained reveal or hover treatment | Reserve image space; keep content usable without animation |

Respect reduced-motion preferences. Motion supports a reduced-motion configuration and hook; use those along with CSS media queries. Reduce or remove movement while retaining state clarity. [Motion accessibility guidance](https://motion.dev/docs/react-accessibility).

Animated backgrounds, scroll hijacking, custom cursors, continuous decorative movement, and long staged entrances are outside this direction. A user must never wait for a visual effect to use a form or identify an action. Do not imitate loading with artificial delays.

## Libraries, references, and content sources

| Resource | Intended use | Review boundary |
| --- | --- | --- |
| [Motion documentation/examples](https://motion.dev/docs/react) | Reference implementations for transitions tied to React state | Adapt only the interaction needed and respect reduced motion |
| [shadcn/ui](https://ui.shadcn.com/docs) | Accessible control patterns and editable source | Own the styling; do not paste an unrelated full dashboard template |
| [Mobbin](https://mobbin.com/) | Research familiar search, booking, form, and detail-view patterns | Public site reviewed as a reference source; specific paid flows have not been inspected or purchased |
| [React Bits](https://github.com/DavidHDev/react-bits) | Optional inspiration for one justified public-page detail | No default dependency; inspect the individual component's license, dependencies, responsiveness, and motion behavior before reuse |
| [Google Fonts](https://fonts.google.com/) | The proposed type pairing | Keep the selected fonts and relevant license files with the implementation |
| [Pexels](https://www.pexels.com/license/) | Possible illustrative imagery when no owner-supplied imagery is available | Track source and applicable license for each selected asset; stock imagery does not identify a real listed venue |

Source selection is not an asset acquisition claim. No paid resources have been purchased and no specific stock photos or third-party application screens have been copied. During implementation, keep a small asset/source register with origin, attribution where applicable, license, purpose, and whether the image is illustrative.

Add a library because a required interaction benefits from it, not because the library is available. Use one date/control approach and one animation runtime. The small sample roster does not require a large table engine or analytics package.

## Quality criteria before expanding the UI

Style three representative screens first: venue discovery/details, merchant booth selection, and organizer application review. They test photography, public navigation, forms, map/list behavior, money/status presentation, and dense operational content. Reuse the resulting components and tokens across the remaining mapped screens.

- Check layouts at 320, 360, 390, 768, 1024, and 1440 CSS pixels, with enlarged text and long names. Keep necessary actions visible without clipped content or hover dependence.
- Aim for at least 44px effective touch targets for primary controls as a product design target. WCAG 2.2's AA minimum target-size criterion is 24px with exceptions; do not misstate 44px as its universal AA minimum. [W3C target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
- Target WCAG 2.2 AA, including 4.5:1 contrast for normal text, visible focus, semantic controls, named inputs, and understandable error recovery. Verify actual rendered combinations; a token palette alone does not establish conformance. [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
- Verify keyboard navigation, modal focus behavior, map/list parity, reduced motion, and screen-reader status announcements. Automated accessibility checks support manual review; they do not replace it.
- Use Core Web Vitals targets of LCP at or below 2.5 seconds, INP at or below 200ms, and CLS at or below 0.1. Field targets are assessed at the 75th percentile; local lab checks guide improvements but do not prove field results. These are goals to measure, not achieved performance claims. [Web Vitals guidance](https://web.dev/articles/vitals).
- Reserve image dimensions, optimize image sizes, lazy-load nonessential imagery, and avoid making every page depend on animation code. Critical content remains visible when media cannot load.
- Check each major screen's initial, loading, empty, error, disabled, selected, and completed states as applicable. Confirm booking/payment success through the business state rather than optimistic visual feedback.
- Run the version 1 journey criteria against the styled interface. Visual changes must preserve organizer-only merchant selection, adjacency rules, deadline behavior, and payment ownership.

## Implementation sequence informed by this brief

1. Establish the React/Next.js/TypeScript project and shared design tokens when implementation begins; retain the fictional demo boundary.
2. Style the three representative screens and verify their responsive behavior, readability, keyboard use, and motion.
3. Extend the approved patterns across the nine screen families and connect the local sample flows with consistent state.
4. Plan and implement the scoped Supabase connection in a dedicated environment, with actual access rules and shared inventory protections before claiming connected behavior. Auth/Storage remain scoped to the features actually being enabled.
5. Prepare the Vercel preview and verify the deployed experience when publishing is requested. Production operation and real transactions remain separate work.

This is the design and technical brief; the linked implementation plan now names files, dependencies, checks, and delivery stages using these choices. A complete connected backend schema belongs to the later integration stage. The venue's exact document checklist remains deferred; AI remains excluded from the product demo.
