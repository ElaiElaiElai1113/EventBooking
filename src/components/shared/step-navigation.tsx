"use client";
import { useState } from "react";
export function StepNavigation({
  steps,
  labels,
  step,
  onChange,
}: {
  steps: string[];
  labels: string[];
  step: string;
  onChange: (step: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const index = Math.max(0, steps.indexOf(step));
  return (
    <div className="step-navigation">
      <button
        className="step-toggle"
        aria-expanded={open}
        aria-controls="setup-step-list"
        onClick={() => setOpen(!open)}
      >
        <span>
          <small>
            Step {index + 1} of {steps.length}
          </small>
          <strong>{labels[index]}</strong>
        </span>
        <span>{open ? "Close steps −" : "Change step +"}</span>
      </button>
      <nav
        id="setup-step-list"
        className={`tabs setup-tabs ${open ? "is-open" : ""}`}
        aria-label="Event setup steps"
      >
        {steps.map((s, i) => (
          <button
            key={s}
            aria-current={step === s ? "step" : undefined}
            onClick={() => {
              onChange(s);
              setOpen(false);
            }}
          >
            {i + 1}. {labels[i]}
          </button>
        ))}
      </nav>
    </div>
  );
}
