"use client";
import { useState } from "react";
import { Zap, ArrowUp, ArrowDown, X, Map, Rows3 } from "lucide-react";
import type { Choice } from "@/domain/model";
import { useDemo } from "@/demo/demo-provider";
import { boothState } from "@/domain/selectors";
import { isEligibleChoice } from "@/domain/inventory";
import { money } from "@/domain/money";
import { Button } from "@/components/ui/button";
export function BoothMap({
  selected,
  onSelect,
}: {
  selected: Choice;
  onSelect: (id: string) => void;
}) {
  const { state } = useDemo();
  const [view, setView] = useState("map");
  return (
    <div className="booth-browser">
      <div className="spread">
        <h3>The space at a glance</h3>
        <div className="segmented" role="tablist" aria-label="Booth view">
          <button
            role="tab"
            aria-selected={view === "map"}
            onClick={() => setView("map")}
          >
            <Map size={15} />
            Map
          </button>
          <button
            role="tab"
            aria-selected={view === "list"}
            onClick={() => setView("list")}
          >
            <Rows3 size={15} />
            List
          </button>
        </div>
      </div>
      {view === "map" && (
        <p className="small muted map-scroll-hint">
          Swipe or scroll to see the whole map, or switch to List.
        </p>
      )}
      <div
        className="floorplan-scroll"
        role="region"
        aria-label="Booth layout; scroll horizontally on smaller screens"
        tabIndex={view === "map" ? 0 : undefined}
      >
        <div className={view === "map" ? "floorplan" : "booth-list"}>
          {view === "map" && (
            <div className="map-top">
              SAMPLE HALL{" "}
              <span>Prepared illustrative layout · not to scale</span>
            </div>
          )}
          {state.event.booths.map((b, i) => (
            <div
              className={view === "map" ? "booth-cell" : "booth-list-row"}
              key={b.id}
            >
              {view === "map" && i === 6 && (
                <div className="walkway">
                  CLEAR WALKWAY · NO CROSS-ROW PAIRS
                </div>
              )}
              <button
                type="button"
                className={`booth ${selected.includes(b.id) ? "selected" : ""} ${boothState(state, b.id) === "Accepting preferences" ? "free" : "occupied"}`}
                aria-label={`Booth ${b.id}`}
                aria-pressed={selected.includes(b.id)}
                onClick={() => onSelect(b.id)}
              >
                <strong>{b.id}</strong>
                <span>
                  {b.power ? (
                    <Zap size={14} />
                  ) : (
                    <span className="power-spacer" />
                  )}
                  {view === "list"
                    ? `${b.width} × ${b.depth}m · ${money(b.price)} · ${boothState(state, b.id)}`
                    : boothState(state, b.id) === "Accepting preferences"
                      ? "Available"
                      : boothState(state, b.id)}
                </span>
              </button>
              {view === "list" && (
                <small>
                  {b.inclusions} ·{" "}
                  {b.power ? `Power up to ${b.watts}W` : "No power"}
                </small>
              )}
            </div>
          ))}
          {view === "map" && (
            <div className="map-entry">
              ↑ MAIN ENTRANCE <span>Booths cover the full event edition</span>
            </div>
          )}
        </div>
      </div>
      <div className="legend">
        <span>□ Accepting preferences</span>
        <span>▧ Held / confirmed</span>
        <span>
          <Zap size={14} /> Power available
        </span>
      </div>
      <p className="small muted">
        Select a booth to inspect. Availability does not guarantee selection by
        the organizer.
      </p>
    </div>
  );
}
export function BoothChoice({
  quantity,
  choices,
  onQuantity,
  onChoices,
}: {
  quantity: 1 | 2;
  choices: Choice[];
  onQuantity: (q: 1 | 2) => void;
  onChoices: (choices: Choice[]) => void;
}) {
  const { state } = useDemo();
  const [selected, setSelected] = useState<Choice>([]),
    [error, setError] = useState("");
  const total = selected.reduce(
    (sum, id) =>
      sum + (state.event.booths.find((b) => b.id === id)?.price ?? 0),
    0,
  );
  const pick = (id: string) => {
    setError("");
    setSelected((old) =>
      old.includes(id)
        ? old.filter((x) => x !== id)
        : old.length >= quantity
          ? [id]
          : [...old, id],
    );
  };
  const add = () => {
    if (
      selected.length !== quantity ||
      !isEligibleChoice(selected, state.event.pairs)
    ) {
      setError(
        "26 + 27 crosses the walkway. Choose a physically eligible adjacent pair within one row.",
      );
      return;
    }
    if (choices.length >= 3) {
      setError("Up to three ranked choices are available in this demo.");
      return;
    }
    if (
      choices.some(
        (c) =>
          c.length === selected.length &&
          c.every((id) => selected.includes(id)),
      )
    ) {
      setError("That choice is already in your preferences.");
      return;
    }
    onChoices([...choices, [...selected]]);
    setSelected([]);
  };
  const move = (i: number, d: number) => {
    const copy = [...choices];
    [copy[i], copy[i + d]] = [copy[i + d], copy[i]];
    onChoices(copy);
  };
  return (
    <>
      <fieldset className="quantity">
        <legend>Requested space</legend>
        <label>
          <input
            type="radio"
            name="quantity"
            checked={quantity === 1}
            onChange={() => {
              onQuantity(1);
              setSelected([]);
            }}
          />
          One booth
        </label>
        <label>
          <input
            type="radio"
            name="quantity"
            checked={quantity === 2}
            onChange={() => {
              onQuantity(2);
              setSelected([]);
            }}
          />
          Two adjacent booths
        </label>
      </fieldset>
      <div className="choice-grid">
        <section>
          <BoothMap selected={selected} onSelect={pick} />
          <div className="selection-summary" aria-live="polite">
            <div>
              <strong data-testid="current-booth-choice">
                {selected.length
                  ? selected.join(" + ")
                  : "Choose your booth" + (quantity === 2 ? " pair" : "")}
              </strong>
              <p>
                {selected.length
                  ? money(total)
                  : "Tap the numbered spaces above."}
              </p>
            </div>
            <Button variant="outline" onClick={add} disabled={!selected.length}>
              Add preference
            </Button>
          </div>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
        </section>
        <aside className="panel preference-panel">
          <p className="eyebrow">ONE APPLICATION</p>
          <h3>Your ranked choices</h3>
          <p className="muted small">
            Backups help the organizer find a suitable space. They are
            alternatives, not additional bookings.
          </p>
          <ol className="preferences">
            {choices.map((p, i) => (
              <li key={p.join("-")}>
                <div className="spread">
                  <strong>
                    {i + 1}. Booths {p.join(" + ")}
                  </strong>
                  <button
                    className="icon-button"
                    aria-label={`Remove preference ${i + 1}`}
                    onClick={() => onChoices(choices.filter((_, j) => j !== i))}
                  >
                    <X size={16} />
                  </button>
                </div>
                <p>
                  {money(
                    p.reduce(
                      (n, id) =>
                        n +
                        (state.event.booths.find((b) => b.id === id)?.price ??
                          0),
                      0,
                    ),
                  )}
                </p>
                <small>
                  {p.every(
                    (id) => boothState(state, id) === "Accepting preferences",
                  )
                    ? "Accepting preferences"
                    : "A booth is unavailable; other choices are kept"}
                </small>
                <div className="rank-actions">
                  <Button
                    variant="ghost"
                    aria-label={`Move preference ${i + 1} up`}
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                  >
                    <ArrowUp size={14} />
                    Up
                  </Button>
                  <Button
                    variant="ghost"
                    aria-label={`Move preference ${i + 1} down`}
                    disabled={i === choices.length - 1}
                    onClick={() => move(i, 1)}
                  >
                    <ArrowDown size={14} />
                    Down
                  </Button>
                </div>
              </li>
            ))}
          </ol>
          {!choices.length && <p>No preferences yet.</p>}
          <p className="small">
            Applying does not reserve a booth. No booth payment is due now.
          </p>
        </aside>
      </div>
    </>
  );
}
