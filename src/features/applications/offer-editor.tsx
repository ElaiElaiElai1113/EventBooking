"use client";
import { useState } from "react";
import type { Application } from "@/domain/model";
import { useDemo } from "@/demo/demo-provider";
import { Button } from "@/components/ui/button";
import { money } from "@/domain/money";
import { afterHours, dateTime, stamp } from "@/domain/time";
import { latestAgreement, boothState } from "@/domain/selectors";
import { TermsView, Notice } from "@/components/shared/common";
export function OfferEditor({ application: a }: { application: Application }) {
  const { state, dispatch } = useDemo();
  const [opened, setOpened] = useState(false),
    [choice, setChoice] = useState(a.draft.choices.at(-1)?.join("+") ?? "");
  const old = latestAgreement(state, a.id);
  const active = old && old.allocation !== "released";
  const all = [...state.event.booths.map((b) => [b.id]), ...state.event.pairs];
  const booths = choice.split("+").filter(Boolean);
  const total = booths.reduce(
    (n, id) => n + (state.event.booths.find((b) => b.id === id)?.price ?? 0),
    0,
  );
  const t = state.event.terms;
  const premature = stamp(state.now) < stamp(state.event.closes);
  return (
    <div>
      <Button
        disabled={premature || (!!active && !!old.acceptedAt)}
        onClick={() => setOpened(!opened)}
      >
        {active ? "Prepare replacement offer" : "Approve and offer booth"}
      </Button>
      {premature && (
        <p className="small muted">
          Initial offers begin after {dateTime(state.event.closes)}. You can
          still inspect, clarify and shortlist.
        </p>
      )}
      {opened && (
        <div className="receipt">
          <h3>Prepare the exact offer</h3>
          <label htmlFor="offer-choice">Offered booth or complete pair</label>
          <select
            id="offer-choice"
            aria-label="Offered booth or complete pair"
            value={choice}
            onChange={(e) => setChoice(e.target.value)}
          >
            {all.map((p) => (
              <option key={p.join("+")} value={p.join("+")}>
                Booths {p.join(" + ")} ·{" "}
                {p.every(
                  (id) => boothState(state, id) === "Accepting preferences",
                )
                  ? "available"
                  : "held / unavailable"}
              </option>
            ))}
          </select>
          {booths.length !== a.draft.quantity && (
            <Notice>
              Explicit quantity substitution: merchant requested{" "}
              {a.draft.quantity}, this offer is for {booths.length}. It requires
              their acceptance.
            </Notice>
          )}
          {!a.draft.choices.some((p) => p.join("+") === choice) && (
            <Notice>
              This is an organizer-suggested alternative outside the ranked
              choices, not an automatic relocation.
            </Notice>
          )}
          <div className="money-rows">
            {booths.map((id) => (
              <div key={id}>
                <span>Booth {id}</span>
                <span>
                  {money(
                    state.event.booths.find((b) => b.id === id)?.price ?? 0,
                  )}
                </span>
              </div>
            ))}
            <div>
              <strong>Total</strong>
              <strong>{money(total)}</strong>
            </div>
            <div>
              <span>Initial payment</span>
              <span>
                {money(
                  t.mode === "full"
                    ? total
                    : Math.round((total * t.percent) / 100),
                )}
              </span>
            </div>
          </div>
          <p className="small">
            Payee: {state.event.organizer}
            <br />
            Expires: {dateTime(afterHours(state.now, 48))}
            <br />
            Balance due:{" "}
            {t.mode === "full" ? "No later balance" : dateTime(t.balanceDue)}
          </p>
          <details>
            <summary>
              Terms included in offer v{(old?.version ?? 0) + 1}
            </summary>
            <TermsView terms={t} />
          </details>
          <Button
            onClick={() => {
              if (
                dispatch({
                  type: "sendOffer",
                  id: a.id,
                  booths,
                  replace: !!active,
                })
              )
                setOpened(false);
            }}
          >
            Send exact offer
          </Button>
        </div>
      )}
    </div>
  );
}
