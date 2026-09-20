"use client";
import Link from "next/link";
import { useDemo } from "@/demo/demo-provider";
import { JourneyProgress } from "@/components/shared/journey-progress";
import { StepNavigation } from "@/components/shared/step-navigation";
import { RecordForm, type Field } from "@/components/shared/record-form";
import { PageHeading, RoleGate, Notice } from "@/components/shared/common";
import { Button } from "@/components/ui/button";
import { localInput, fromInput } from "@/domain/time";
import { publicationIssues } from "@/domain/publication";
import { BoothMap } from "@/features/booths/booth-choice";
import { useState } from "react";
import { ReviewPacket } from "./review-packet";
import { CoordinationPanel } from "./coordination-panel";
import { EventPublic } from "./event-public";
import { physicalPairs } from "@/demo/fixtures";
import { money, pesos } from "@/domain/money";
import { latestAgreement, balance } from "@/domain/selectors";
const steps = ["details", "venue", "applications", "payments", "preview"];
const labels = [
  "Event details",
  "Venue & layout",
  "Applications",
  "Payments & policies",
  "Preview & publish",
];
export function EventSetup() {
  const { state, dispatch, nav } = useDemo();
  const e = state.event,
    a = e.arrangement;
  const step = state.navigation.setupStep ?? "details";
  const [boothId, setBoothId] = useState("23");
  const b = e.booths.find((b) => b.id === boothId)!;
  const issues = publicationIssues(state);
  const rental = latestAgreement(state, "organizer-rental");
  const next = () =>
    nav("setupStep", steps[Math.min(4, steps.indexOf(step) + 1)]);
  const save = (patch: Parameters<typeof dispatch>[0]) => {
    const ok = dispatch(patch);
    if (ok) next();
    return ok;
  };
  const timeField = (name: string, label: string): Field => ({
    name,
    label,
    type: "datetime-local",
    required: true,
  });
  return (
    <RoleGate roles={["organizer"]}>
      <div className="container workspace">
        <PageHeading
          eyebrow="SAMPLE MARKET TEAM · EVENT WORKSPACE"
          title={e.name || "Prepare your event"}
          description={`Arrangement v${a.version} · ${e.status === "published" ? "Published" : "Draft"} · You can keep drafting while the venue reviews.`}
          action={
            <Link className="button button-ghost" href="/organizer/events">
              Save and exit
            </Link>
          }
        />
        <JourneyProgress id={e.id} />
        <StepNavigation
          steps={steps}
          labels={labels}
          step={step}
          onChange={(s) => nav("setupStep", s)}
        />
        {step === "details" && (
          <section className="panel">
            <h2>Start with the essentials.</h2>
            <RecordForm
              id="event-details"
              values={{
                name: e.name,
                organizer: e.organizer,
                contact: e.contact,
                description: e.description,
                start: localInput(e.start),
                end: localInput(e.end),
                setup: localInput(e.setup),
                cleanup: localInput(e.cleanup),
              }}
              fields={[
                { name: "name", label: "Event name", required: true },
                {
                  name: "organizer",
                  label: "Organizer business name",
                  required: true,
                },
                {
                  name: "contact",
                  label: "Organizer contact",
                  type: "email",
                  required: true,
                },
                {
                  name: "description",
                  label: "Merchant-facing description",
                  type: "textarea",
                  full: true,
                  required: true,
                },
                timeField("start", "Event starts (Philippine time)"),
                timeField("end", "Event ends (Philippine time)"),
                timeField("setup", "Setup begins (Philippine time)"),
                timeField("cleanup", "Cleanup ends (Philippine time)"),
              ]}
              submit="Save and continue"
              onSubmit={(v) =>
                save({
                  type: "saveEvent",
                  patch: {
                    name: v.name,
                    organizer: v.organizer,
                    contact: v.contact,
                    description: v.description,
                    start: fromInput(v.start),
                    end: fromInput(v.end),
                    setup: fromInput(v.setup),
                    cleanup: fromInput(v.cleanup),
                  },
                })
              }
            />
          </section>
        )}
        {step === "venue" && (
          <div className="stack">
            <section className="panel">
              <h2>Venue arrangement & access</h2>
              <p>
                Organizer pays venue.{" "}
                {rental
                  ? `Separate rental balance: ${money(balance(state, rental))}.`
                  : ""}{" "}
                <Link className="back" href="/bookings/organizer-rental">
                  Open rental record →
                </Link>
              </p>
              <RecordForm
                id={`arrangement-${a.version}`}
                values={{
                  existing: a.existing ? "yes" : "no",
                  venueName: a.venueName,
                  address: a.address,
                  contact: a.contact,
                  rules: a.rules,
                  accessStart: localInput(a.accessStart),
                  accessEnd: localInput(a.accessEnd),
                  prerequisite: a.prerequisite,
                }}
                fields={[
                  {
                    name: "existing",
                    label: "Venue arrangement source",
                    required: true,
                    options: [
                      { value: "no", label: "Listed venue · Sample Hall" },
                      {
                        value: "yes",
                        label: "Recorded existing arrangement · sample",
                      },
                    ],
                  },
                  { name: "venueName", label: "Venue name", required: true },
                  {
                    name: "address",
                    label: "Illustrative address",
                    required: true,
                  },
                  { name: "contact", label: "Venue contact", required: true },
                  timeField("accessStart", "Venue access begins"),
                  timeField("accessEnd", "Venue access ends"),
                  {
                    name: "rules",
                    label: "Venue operating rules",
                    type: "textarea",
                    required: true,
                    full: true,
                  },
                  {
                    name: "prerequisite",
                    label: "Recorded publication prerequisite",
                    required: true,
                    options: [
                      {
                        value: "none",
                        label: "No rental payment prerequisite",
                      },
                      {
                        value: "deposit",
                        label: "Verified rental deposit required",
                      },
                    ],
                  },
                ]}
                submit="Save venue arrangement"
                onSubmit={(v) =>
                  dispatch({
                    type: "saveArrangement",
                    rules: v.rules,
                    accessStart: fromInput(v.accessStart),
                    accessEnd: fromInput(v.accessEnd),
                    existing: v.existing === "yes",
                    venueName: v.venueName,
                    address: v.address,
                    contact: v.contact,
                    prerequisite: v.prerequisite as "none" | "deposit",
                  })
                }
              />
            </section>
            <section className="panel">
              <div className="spread">
                <h2>Prepared booth layout</h2>
                <Button variant="outline" onClick={() => setBoothId("23")}>
                  Use sample layout
                </Button>
              </div>
              <BoothMap selected={[boothId]} onSelect={setBoothId} />
              <h3>Edit booth {b.id}</h3>
              <RecordForm
                key={`${b.id}-${a.version}`}
                id={`booth-${b.id}-${a.version}`}
                values={{
                  width: String(b.width),
                  depth: String(b.depth),
                  price: String(b.price / 100),
                  power: b.power ? "yes" : "no",
                  watts: String(b.watts),
                  inclusions: b.inclusions,
                  restrictions: b.restrictions,
                  unavailable: b.unavailable ? "yes" : "no",
                }}
                fields={[
                  {
                    name: "width",
                    label: "Width (metres)",
                    type: "number",
                    required: true,
                  },
                  {
                    name: "depth",
                    label: "Depth (metres)",
                    type: "number",
                    required: true,
                  },
                  {
                    name: "price",
                    label: "Booth price (PHP)",
                    type: "number",
                    required: true,
                  },
                  {
                    name: "power",
                    label: "Power available",
                    required: true,
                    options: [
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" },
                    ],
                  },
                  {
                    name: "watts",
                    label: "Power limit (watts)",
                    type: "number",
                    required: true,
                  },
                  {
                    name: "unavailable",
                    label: "Application availability",
                    required: true,
                    options: [
                      { value: "no", label: "Available" },
                      { value: "yes", label: "Unavailable" },
                    ],
                  },
                  {
                    name: "inclusions",
                    label: "Booth inclusions",
                    required: true,
                  },
                  {
                    name: "restrictions",
                    label: "Booth restrictions",
                    required: true,
                  },
                ]}
                submit="Save booth facts"
                onSubmit={(v) =>
                  dispatch({
                    type: "editBooth",
                    booth: {
                      ...b,
                      width: Number(v.width),
                      depth: Number(v.depth),
                      price: pesos(v.price),
                      power: v.power === "yes",
                      watts: Number(v.watts),
                      unavailable: v.unavailable === "yes",
                      inclusions: v.inclusions,
                      restrictions: v.restrictions,
                    },
                  })
                }
              />
              <details>
                <summary>Edit physically eligible pair links</summary>
                <p>
                  Pairs must stay within their row. 26 + 27 crosses the walkway.
                </p>
                {physicalPairs.map((pair) => (
                  <label className="check" key={pair.join("-")}>
                    <input
                      type="checkbox"
                      checked={e.pairs.some(
                        (p) => p.join("-") === pair.join("-"),
                      )}
                      onChange={(ev) =>
                        dispatch({
                          type: "editPairs",
                          pairs: ev.target.checked
                            ? [...e.pairs, pair]
                            : e.pairs.filter(
                                (p) => p.join("-") !== pair.join("-"),
                              ),
                        })
                      }
                    />
                    {pair.join(" + ")}
                  </label>
                ))}
              </details>
            </section>
            <section className="panel">
              <ReviewPacket />
              <CoordinationPanel />
            </section>
            <Button onClick={next}>Continue to applications</Button>
          </div>
        )}
        {step === "applications" && (
          <section className="panel">
            <h2>Set a clear application window.</h2>
            <Notice>
              Organizers select merchants after closing. Applying and
              shortlisting never reserve a booth.
            </Notice>
            <RecordForm
              id="event-applications"
              values={{
                opens: localInput(e.opens),
                closes: localInput(e.closes),
                decisions: localInput(e.decisions),
                categories: e.categories,
                selection: e.selection,
              }}
              fields={[
                timeField("opens", "Applications open"),
                timeField("closes", "Applications close"),
                timeField("decisions", "Expected initial decisions"),
                {
                  name: "categories",
                  label: "Permitted products and categories",
                  required: true,
                },
                {
                  name: "selection",
                  label: "Selection explanation",
                  type: "textarea",
                  required: true,
                  full: true,
                },
              ]}
              submit="Save and continue"
              onSubmit={(v) =>
                save({
                  type: "saveEvent",
                  patch: {
                    opens: fromInput(v.opens),
                    closes: fromInput(v.closes),
                    decisions: fromInput(v.decisions),
                    categories: v.categories,
                    selection: v.selection,
                  },
                })
              }
            />
          </section>
        )}
        {step === "payments" && (
          <section className="panel">
            <h2>Clear terms before anyone applies.</h2>
            <RecordForm
              id={`terms-${e.terms.version}`}
              values={{
                mode: e.terms.mode,
                percent: String(e.terms.percent),
                balanceDue: localInput(e.terms.balanceDue),
                instructions: e.terms.instructions,
                withdrawal: e.terms.withdrawal,
                organizerCancellation: e.terms.organizerCancellation,
                missedBalance: e.terms.missedBalance,
              }}
              fields={[
                {
                  name: "mode",
                  label: "Event payment mode",
                  required: true,
                  options: [
                    { value: "deposit", label: "Deposit plus later balance" },
                    { value: "full", label: "Full payment upfront" },
                  ],
                },
                {
                  name: "percent",
                  label: "Deposit percentage (deposit mode only)",
                  type: "number",
                },
                {
                  name: "balanceDue",
                  label: "Balance due (deposit mode only)",
                  type: "datetime-local",
                },
                {
                  name: "instructions",
                  label: "Sample direct-payment instructions",
                  type: "textarea",
                  required: true,
                  full: true,
                },
                {
                  name: "withdrawal",
                  label: "Merchant withdrawal policy",
                  type: "textarea",
                  required: true,
                  full: true,
                },
                {
                  name: "organizerCancellation",
                  label: "Organizer cancellation or change policy",
                  type: "textarea",
                  required: true,
                  full: true,
                },
                {
                  name: "missedBalance",
                  label: "Missed-balance policy",
                  type: "textarea",
                  required: true,
                  full: true,
                },
              ]}
              submit="Save and preview"
              onSubmit={(v) =>
                save({
                  type: "saveTerms",
                  terms: {
                    ...e.terms,
                    mode: v.mode as "deposit" | "full",
                    percent: Number(v.percent),
                    balanceDue: v.balanceDue
                      ? fromInput(v.balanceDue)
                      : e.terms.balanceDue,
                    instructions: v.instructions,
                    withdrawal: v.withdrawal,
                    organizerCancellation: v.organizerCancellation,
                    missedBalance: v.missedBalance,
                  },
                })
              }
            />
          </section>
        )}
        {step === "preview" && (
          <>
            <section className="panel">
              <h2>Ready to share?</h2>
              {issues.length ? (
                <div className="error">
                  <p>Resolve these items before publishing:</p>
                  {issues.map((i, n) => (
                    <p key={n}>
                      <button
                        className="button button-ghost"
                        onClick={() => nav("setupStep", i.field ?? "details")}
                      >
                        {i.message} →
                      </button>
                    </p>
                  ))}
                </div>
              ) : (
                <Notice>
                  Current venue agreement and publication checks are complete.
                  Publishing creates no booth holds or payment records.
                </Notice>
              )}
              <Button
                disabled={issues.length > 0}
                onClick={() => dispatch({ type: "publish" })}
              >
                Publish event
              </Button>
              {e.status === "published" && (
                <p role="status">
                  <Link href={`/events/${e.id}`}>
                    Event published · View public event →
                  </Link>
                </p>
              )}
            </section>
            <h2 style={{ marginTop: 32 }}>Merchant-facing preview</h2>
            <EventPublic preview />
          </>
        )}
      </div>
    </RoleGate>
  );
}
