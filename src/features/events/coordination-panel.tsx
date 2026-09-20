"use client";
import { useDemo } from "@/demo/demo-provider";
import { RecordForm } from "@/components/shared/record-form";
import { Button } from "@/components/ui/button";
import { afterHours, dateTime, localInput, fromInput } from "@/domain/time";
export function CoordinationPanel({ context = "event" }: { context?: string }) {
  const { state, dispatch } = useDemo();
  const messages =
    context === "event"
      ? state.event.messages
      : (state.bookings.find((b) => b.id === context)?.messages ??
        state.applications.find((a) => a.id === context)?.messages ??
        []);
  return (
    <details>
      <summary>
        {context === "event"
          ? "Private messages & optional meetings"
          : "Questions & replies"}
      </summary>
      <p className="small muted">
        Local sample conversation. No message or calendar invitation is sent.
      </p>
      {messages.map((m) => (
        <div className="message" key={m.id}>
          <small>
            {m.from} · {dateTime(m.at)}
          </small>
          <p>{m.text}</p>
        </div>
      ))}
      <RecordForm
        key={messages.length}
        id={`message-${context}-${messages.length}`}
        values={{ text: "" }}
        fields={[
          {
            name: "text",
            label: "Sample message",
            type: "textarea",
            required: true,
            full: true,
          },
        ]}
        submit="Add sample message"
        onSubmit={(v) => dispatch({ type: "message", context, text: v.text })}
      />
      {context === "event" && (
        <>
          <h3>Optional meeting</h3>
          {state.event.meetings.map((m) => (
            <div className="receipt" key={m.id}>
              <h3>{m.agenda}</h3>
              <p>
                {dateTime(m.time)} · {m.duration} minutes · {m.kind}
                <br />
                {m.details}
              </p>
              <p>
                {m.proposer} → {m.recipient} · <strong>{m.state}</strong>
              </p>
              <div className="action-row">
                {m.state === "proposed" && m.recipient === state.role && (
                  <>
                    <Button
                      onClick={() =>
                        dispatch({
                          type: "respondMeeting",
                          id: m.id,
                          decision: "accept",
                        })
                      }
                    >
                      Accept meeting
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        dispatch({
                          type: "respondMeeting",
                          id: m.id,
                          decision: "decline",
                        })
                      }
                    >
                      Decline meeting
                    </Button>
                  </>
                )}
                {["proposed", "accepted"].includes(m.state) && (
                  <Button
                    variant="ghost"
                    onClick={() =>
                      dispatch({
                        type: "respondMeeting",
                        id: m.id,
                        decision: "cancel",
                      })
                    }
                  >
                    Cancel meeting
                  </Button>
                )}
              </div>
              {m.recipient === state.role &&
                ["proposed", "accepted"].includes(m.state) && (
                  <RecordForm
                    id={`counter-${m.id}-${m.time}`}
                    values={{ time: localInput(afterHours(m.time, 2)) }}
                    fields={[
                      {
                        name: "time",
                        label: "Suggested meeting time",
                        type: "datetime-local",
                        required: true,
                      },
                    ]}
                    submit="Suggest another time"
                    onSubmit={(v) =>
                      dispatch({
                        type: "respondMeeting",
                        id: m.id,
                        decision: "counter",
                        time: fromInput(v.time),
                      })
                    }
                  />
                )}
            </div>
          ))}
          <RecordForm
            key={`meeting-${state.event.meetings.length}`}
            id={`meeting-${state.event.meetings.length}`}
            values={{
              agenda: "Review the layout and power needs",
              time: localInput(afterHours(state.now, 24)),
              duration: "30",
              kind: "online",
              details: "Sample online discussion; no real call link",
            }}
            fields={[
              {
                name: "agenda",
                label: "Meeting agenda",
                required: true,
                full: true,
              },
              {
                name: "time",
                label: "Proposed meeting time",
                type: "datetime-local",
                required: true,
              },
              {
                name: "duration",
                label: "Duration (minutes)",
                type: "number",
                required: true,
              },
              {
                name: "kind",
                label: "Meeting type",
                required: true,
                options: [
                  { value: "online", label: "Online" },
                  { value: "in-person", label: "In person" },
                ],
              },
              {
                name: "details",
                label: "Meeting location or sample details",
                required: true,
              },
            ]}
            submit="Propose sample meeting"
            onSubmit={(v) =>
              dispatch({
                type: "meeting",
                agenda: v.agenda,
                time: fromInput(v.time),
                duration: Number(v.duration),
                kind: v.kind as "online" | "in-person",
                details: v.details,
              })
            }
          />
          <p className="small">
            A meeting or message never approves the arrangement.
          </p>
        </>
      )}
    </details>
  );
}
