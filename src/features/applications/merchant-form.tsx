"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import { useDemo } from "@/demo/demo-provider";
import {
  PageHeading,
  Back,
  RoleGate,
  TermsView,
  Notice,
  ActionLink,
} from "@/components/shared/common";
import { BoothChoice } from "@/features/booths/booth-choice";
import { RecordForm } from "@/components/shared/record-form";
import { Button } from "@/components/ui/button";
import { applicationWindow } from "@/domain/time";
export function MerchantForm() {
  const { state, dispatch, nav } = useDemo();
  const router = useRouter();
  const a = state.applications.find((a) => a.businessId === state.identity);
  const step = state.navigation.applicationStep ?? "business";
  if (!a)
    return (
      <RoleGate roles={["merchant"]}>
        <p>Application unavailable.</p>
      </RoleGate>
    );
  const draft = a.draft;
  const hasOffer = state.agreements.some(
    (g) => g.parentId === a.id && g.allocation !== "released",
  );
  const canEdit =
    applicationWindow(state.now, state.event.opens, state.event.closes) ===
      "open" || a.correctionRequested;
  const go = (s: string) => {
    nav("applicationStep", s);
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>("h1")?.focus(),
    );
  };
  return (
    <RoleGate roles={["merchant"]}>
      <div className="container">
        <Back href="/events/makers-market-2026">Event details</Back>
        <PageHeading
          eyebrow={`SAMPLE DAVAO MAKERS MARKET · STEP ${step === "business" ? 1 : step === "booths" ? 2 : 3} OF 3`}
          title={
            step === "business"
              ? "Tell us what you make."
              : step === "booths"
                ? "Find your place at the market."
                : "One application. Your best options."
          }
          description="Your business information and alternatives stay together in one application."
        />
        <nav className="tabs" aria-label="Application steps">
          {[
            ["business", "1. Business & needs"],
            ["booths", "2. Booth preferences"],
            ["review", "3. Review & submit"],
          ].map(([s, label]) => (
            <button
              key={s}
              aria-current={step === s ? "step" : undefined}
              onClick={() => go(s)}
            >
              {label}
            </button>
          ))}
        </nav>
        {!canEdit || hasOffer ? (
          <>
            <Notice>
              {hasOffer
                ? "An exact offer is active. Your submitted application is preserved; ask the organizer about changes."
                : "Applications are closed. Your existing application remains available; requested corrections use the same record."}
            </Notice>
            <ActionLink href={`/applications/${a.id}`}>
              View your application
            </ActionLink>
          </>
        ) : (
          <motion.div
            key={step}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.16 }}
          >
            {step === "business" && (
              <div className="two-columns">
                <section className="panel">
                  <RecordForm
                    id={`merchant-${a.id}`}
                    values={{
                      name: draft.name,
                      contact: draft.contact,
                      category: draft.category,
                      products: draft.products,
                      needs: draft.needs,
                      power: draft.power ? "yes" : "no",
                      watts: String(draft.watts),
                    }}
                    fields={[
                      { name: "name", label: "Business name", required: true },
                      {
                        name: "contact",
                        label: "Responsible contact email",
                        type: "email",
                        required: true,
                      },
                      {
                        name: "category",
                        label: "Product category",
                        required: true,
                      },
                      {
                        name: "products",
                        label: "Products for this event",
                        type: "textarea",
                        required: true,
                        full: true,
                      },
                      {
                        name: "needs",
                        label: "Operating and equipment needs",
                        type: "textarea",
                        full: true,
                      },
                      {
                        name: "power",
                        label: "Needs power",
                        required: true,
                        options: [
                          { value: "no", label: "No power needed" },
                          { value: "yes", label: "Power connection needed" },
                        ],
                      },
                      {
                        name: "watts",
                        label: "Equipment power (watts)",
                        type: "number",
                      },
                    ]}
                    submit="Continue to booth preferences"
                    onDraft={(v) =>
                      dispatch({
                        type: "saveApplication",
                        id: a.id,
                        draft: {
                          ...draft,
                          name: v.name,
                          contact: v.contact,
                          category: v.category,
                          products: v.products,
                          needs: v.needs,
                          power: v.power === "yes",
                          watts: Number(v.watts) || 0,
                        },
                      })
                    }
                    onSubmit={(v) => {
                      if (
                        dispatch({
                          type: "saveApplication",
                          id: a.id,
                          draft: {
                            ...draft,
                            name: v.name,
                            contact: v.contact,
                            category: v.category,
                            products: v.products,
                            needs: v.needs,
                            power: v.power === "yes",
                            watts: Number(v.watts),
                          },
                        })
                      ) {
                        go("booths");
                        return true;
                      }
                      return false;
                    }}
                  />
                </section>
                <aside>
                  <Image
                    src="/demo/products.svg"
                    alt="Illustrative handmade paper goods and pottery"
                    width={480}
                    height={320}
                    className="product-image"
                  />
                  <p className="small muted">
                    Supplied example image. This demo does not upload photos.
                  </p>
                  <Notice>
                    Your reusable profile can change without silently rewriting
                    a submitted application.
                  </Notice>
                  <details>
                    <summary>Edit reusable profile name</summary>
                    <RecordForm
                      id={`profile-${a.id}`}
                      values={{
                        name: state.profiles.find((p) => p.id === a.id)!.name,
                      }}
                      fields={[
                        {
                          name: "name",
                          label: "Reusable profile business name",
                          required: true,
                        },
                      ]}
                      submit="Save profile only"
                      onSubmit={(v) =>
                        dispatch({
                          type: "saveProfile",
                          id: a.id,
                          name: v.name,
                        })
                      }
                    />
                  </details>
                </aside>
              </div>
            )}
            {step === "booths" && (
              <>
                <BoothChoice
                  quantity={draft.quantity}
                  choices={draft.choices}
                  onQuantity={(quantity) =>
                    dispatch({
                      type: "saveApplication",
                      id: a.id,
                      draft: { ...draft, quantity, choices: [] },
                    })
                  }
                  onChoices={(choices) =>
                    dispatch({
                      type: "saveApplication",
                      id: a.id,
                      draft: { ...draft, choices },
                    })
                  }
                />
                <label className="check">
                  <input
                    type="checkbox"
                    checked={draft.alternatives}
                    onChange={(e) =>
                      dispatch({
                        type: "saveApplication",
                        id: a.id,
                        draft: { ...draft, alternatives: e.target.checked },
                      })
                    }
                  />
                  Open to organizer-suggested alternatives; every substitute
                  still needs my acceptance
                </label>
                <div className="form-actions">
                  <Button variant="outline" onClick={() => go("business")}>
                    Back
                  </Button>
                  <Button onClick={() => go("review")}>
                    Review application
                  </Button>
                </div>
              </>
            )}
            {step === "review" && (
              <div className="two-columns">
                <section className="panel">
                  <h2>{draft.name}</h2>
                  <p>
                    {draft.category} · {draft.contact}
                  </p>
                  <p>{draft.products}</p>
                  <p>{draft.needs}</p>
                  <h3>
                    {draft.quantity === 2 ? "Two adjacent booths" : "One booth"}{" "}
                    · ranked alternatives
                  </h3>
                  {draft.choices.map((p, i) => (
                    <p key={i}>
                      {i + 1}. Booths {p.join(" + ")}
                    </p>
                  ))}
                  <Notice>
                    Applying does not reserve a booth. No booth payment is due
                    now.
                  </Notice>
                  <div className="form-actions">
                    <Button variant="outline" onClick={() => go("booths")}>
                      Back to preferences
                    </Button>
                    <Button
                      onClick={() => {
                        if (dispatch({ type: "submitApplication", id: a.id }))
                          router.push(`/applications/${a.id}`);
                      }}
                    >
                      {a.snapshots.length
                        ? "Submit deliberate revision"
                        : "Submit application"}
                    </Button>
                  </div>
                </section>
                <aside className="panel">
                  <TermsView terms={state.event.terms} />
                </aside>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </RoleGate>
  );
}
