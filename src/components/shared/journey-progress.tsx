"use client";
import { useRouter } from "next/navigation";
import { useDemo } from "@/demo/demo-provider";
import { journeyFor } from "@/domain/presentation";
import { dateTime, stamp } from "@/domain/time";
import { Button } from "@/components/ui/button";

export function JourneyProgress({ id }: { id: string }) {
  const { state, present, nav } = useDemo();
  const router = useRouter();
  const j = journeyFor(state, id);
  if (!j) return null;
  const same = j.role === state.role && j.identity === state.identity;
  return (
    <section
      className="journey-progress no-print"
      aria-label="Journey progress"
    >
      <ol className="journey-steps">
        {j.steps.map((step, i) => (
          <li key={step} aria-current={i === j.step ? "step" : undefined}>
            <span aria-hidden="true">{i + 1}</span>
            {step}
          </li>
        ))}
      </ol>
      <div className="journey-summary">
        <div>
          <p className="eyebrow">
            {j.role
              ? `${same ? "YOUR TURN" : `${j.role.toUpperCase()} ACTS NEXT`}`
              : "CURRENT STAGE"}
          </p>
          <h2 aria-live="polite">{j.stage}</h2>
          <p>{j.detail}</p>
          {j.deadline && (
            <p className="small">
              {stamp(state.now) > stamp(j.deadline)
                ? "Past the sample deadline"
                : "Sample deadline"}
              : <strong>{dateTime(j.deadline)}</strong>
            </p>
          )}
        </div>
        {j.role && j.identity && j.href && !same && (
          <div className="journey-handoff">
            <Button
              variant="outline"
              onClick={() => {
                present(j.role!, j.identity);
                if (id === state.event.id && j.role === "organizer")
                  nav("setupStep", j.step < 3 ? "venue" : "preview");
                router.push(j.href!);
              }}
            >
              Continue as {j.role === "venue" ? "venue reviewer" : j.role}
            </Button>
            <small>Demo perspective only · keeps this scene and record</small>
          </div>
        )}
      </div>
    </section>
  );
}
