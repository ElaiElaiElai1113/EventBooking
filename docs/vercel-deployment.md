# Vercel demo deployment

20 September 2026. The user explicitly requested Vercel hosting after committing and pushing the demo to GitHub.

- Public URL: https://eventbooking-pi.vercel.app
- Project: `elaielaielai1113s-projects/eventbooking`
- GitHub: `ElaiElaiElai1113/EventBooking`, production branch `main`, connected through Vercel.
- Verified deployment: `dpl_GTaDHMaoNFyJrdJS5oTvKum8ZHqz`, status `READY`, target `production`.
- Immutable URL: https://eventbooking-a7ng09e6m-elaielaielai1113s-projects.vercel.app
- Deployed source: `a3b4d25deca095d61b9d0c60b16fb20405fc2bd6`.
- Vercel deployment API confirmed Node `22.x`; Next.js `16.3.5` compiled and completed TypeScript/static generation successfully on Vercel.

The Vercel environment is called production, but this is still a fictional demonstration. Supabase is disconnected; roles are simulated, with no real authentication, payments, messages, uploads or shared database. State remains in each browser's localStorage on this origin. Localhost state does not transfer to the hosted origin. The temporary product name is unchanged. No provider credentials were required.

## Hosted verification

Fresh lint, TypeScript and 56 unit/component checks passed before deploying. The existing Playwright suite then ran against the public URL with one worker and retries disabled: **54 passed, 2 navigation timeouts** in 7.1 minutes. All 28 mobile checks passed. The two desktop failures occurred in `page.goto` / `page.waitForURL` while waiting for the load event; the rendered app was present. Trace inspection showed unfinished font/chunk requests and some successful asset downloads taking about 20–22 seconds. This suggests intermittent delivery/network delay; the exact upstream cause was not established. Do not describe the first run as an uninterrupted 56-test pass.

The original output is retained in [vercel-browser.txt](evidence/vercel-browser.txt). The two failed cases were selected explicitly for a targeted recheck with a 90-second test timeout: **both passed**, taking 13.1 and 14.2 seconds respectively (28 seconds total). No application changes were made between runs. See [vercel-browser-recheck.txt](evidence/vercel-browser-recheck.txt). Thus all 56 cases passed across the initial run and targeted recheck, with the two initial timing failures retained above.

The organizer setup route was opened directly, switched through visible demo controls, and refreshed at 390px and 1440px widths. Both renders had no page JavaScript errors, no horizontal overflow, no broken images, and retained `noindex, nofollow`. Both screenshots were visually inspected. The first direct request returned HTTP 200 and showed the expected simulated-role boundary before switching to organizer. See [smoke results](evidence/vercel-smoke.json), [mobile screenshot](evidence/vercel-setup-390.png), and [desktop screenshot](evidence/vercel-setup-1440.png).

These checks verify the hosted fictional flows and selected layouts. Historical local performance measurements remain local; this deployment does not establish field performance, multi-user authorization, concurrency safety or independent user acceptance.

## Reproduce

```powershell
$env:DEMO_BASE_URL='https://eventbooking-pi.vercel.app'
node node_modules/@playwright/test/cli.js test
# Optional targeted diagnostic for the two initial navigation timeouts:
node node_modules/@playwright/test/cli.js test --project=chromium --timeout=90000 --grep 'accessibility /events/makers-market-2026/apply|keyboard dialog'
Remove-Item Env:DEMO_BASE_URL
```

Setting `DEMO_BASE_URL` disables the local web-server fixture. Test data remains fictional and browser-local. `.vercel/` is ignored by Git. Subsequent documentation/evidence commits do not change application behavior; the source revision above identifies the deployment actually exercised here.
