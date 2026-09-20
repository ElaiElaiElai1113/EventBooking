"use client";
import { useDemo } from "@/demo/demo-provider";
import { RecordForm } from "@/components/shared/record-form";
import { Button } from "@/components/ui/button";
import { Status, Notice, History } from "@/components/shared/common";
export function ReviewPacket() {
  const { state, dispatch } = useDemo();
  const a = state.event.arrangement;
  const venue = state.role === "venue";
  const ready = a.packet.every(
    (p) =>
      !p.required ||
      !p.applicable ||
      (p.supplied && !p.change && p.reviewedVersion === p.version),
  );
  return (
    <section>
      <div className="spread">
        <h2>
          Current review packet <span className="muted">v{a.version}</span>
        </h2>
        <Status>
          <span data-testid="venue-agreement-status">
            {a.agreedVersion === a.version
              ? "Agreed"
              : "Awaiting current agreement"}
          </span>
        </Status>
      </div>
      <Notice>
        Sample checklist only. Supplied information is not automatically
        reviewed. Exact venue document requirements remain to be validated.
      </Notice>
      {a.packet.map((p) => (
        <div className="receipt" key={p.id}>
          <div className="spread">
            <h3>{p.title}</h3>
            <Status>
              {!p.applicable
                ? "Not applicable"
                : p.change
                  ? "Changes needed"
                  : p.reviewedVersion === p.version
                    ? "Reviewed"
                    : p.supplied
                      ? "Supplied"
                      : "Missing"}
            </Status>
          </div>
          <p className="small">
            Owner: {p.owner} · {p.required ? "Required" : "Optional"} · version{" "}
            {p.version}
          </p>
          {p.change && <p className="error">{p.change}</p>}
          <details>
            <summary>Preview sample information</summary>
            <p>{p.preview}</p>
          </details>
          {state.role === p.owner && (
            <details>
              <summary>Revise supplied information</summary>
              <RecordForm
                key={p.version}
                id={`packet-${p.id}-${p.version}`}
                values={{ preview: p.preview }}
                fields={[
                  {
                    name: "preview",
                    label: `${p.title} sample content`,
                    type: "textarea",
                    required: true,
                    full: true,
                  },
                ]}
                submit="Supply revised information"
                onSubmit={(v) =>
                  dispatch({
                    type: "supplyPacket",
                    id: p.id,
                    preview: v.preview,
                  })
                }
              />
            </details>
          )}
          {venue && (
            <>
              <Button
                variant="outline"
                disabled={
                  !p.supplied || !!p.change || p.reviewedVersion === p.version
                }
                onClick={() =>
                  dispatch({
                    type: "reviewPacket",
                    id: p.id,
                    decision: "review",
                    text: "Current supplied version inspected",
                  })
                }
              >
                Mark {p.title.toLowerCase()} reviewed
              </Button>
              <details>
                <summary>Request change or mark not applicable</summary>
                <RecordForm
                  id={`packet-decision-${p.id}-${p.version}`}
                  values={{ decision: "change", text: "" }}
                  fields={[
                    {
                      name: "decision",
                      label: `${p.title} review decision`,
                      required: true,
                      options: [
                        { value: "change", label: "Request a specific change" },
                        {
                          value: "not-applicable",
                          label: "Not applicable for this event",
                        },
                      ],
                    },
                    {
                      name: "text",
                      label: `${p.title} review reason`,
                      required: true,
                    },
                  ]}
                  submit="Record packet decision"
                  onSubmit={(v) =>
                    dispatch({
                      type: "reviewPacket",
                      id: p.id,
                      decision: v.decision as "change" | "not-applicable",
                      text: v.text,
                    })
                  }
                />
              </details>
            </>
          )}
        </div>
      ))}
      {venue && (
        <>
          <label className="check">
            <input
              type="checkbox"
              checked={ready}
              disabled={ready}
              onChange={() => dispatch({ type: "reviewAllPacket" })}
            />
            I reviewed the current required packet
          </label>
          <Button
            disabled={!ready || a.agreedVersion === a.version}
            onClick={() => dispatch({ type: "agree" })}
          >
            Agree to arrangement
          </Button>
        </>
      )}
      <History items={a.history} />
    </section>
  );
}
