"use client";
import type { Booking } from "@/domain/model";
import { useDemo } from "@/demo/demo-provider";
import { RecordForm } from "@/components/shared/record-form";
import { fromInput, localInput } from "@/domain/time";
import { pesos } from "@/domain/money";
import { latestAgreement } from "@/domain/selectors";
export function QuoteForm({ booking: b }: { booking: Booking }) {
  const { state, dispatch } = useDemo();
  const a = latestAgreement(state, b.id);
  return (
    <section className="panel">
      <h2>{a ? "Revise quote" : "Prepare quote & hold"}</h2>
      <p className="small">
        The full access interval is checked when sending. This venue uses a
        sample 24-hour hold.
      </p>
      <RecordForm
        key={a?.id ?? b.id}
        id={`quote-${b.id}-${a?.version ?? 0}`}
        values={{
          eventStart: localInput(a?.eventStart ?? b.draft.start),
          eventEnd: localInput(a?.eventEnd ?? b.draft.end),
          total: String((a?.total ?? 2000000) / 100),
          initial: String((a?.initial ?? 1000000) / 100),
          accessStart: localInput(a?.accessStart ?? b.draft.accessStart),
          accessEnd: localInput(a?.accessEnd ?? b.draft.accessEnd),
          balanceDue:
            b.id === "organizer-rental"
              ? "2026-11-11T18:00"
              : "2026-11-05T18:00",
          inclusions: b.draft.package,
        }}
        fields={[
          {
            name: "eventStart",
            label: "Quoted event begins",
            type: "datetime-local",
            required: true,
          },
          {
            name: "eventEnd",
            label: "Quoted event ends",
            type: "datetime-local",
            required: true,
          },
          {
            name: "total",
            label: "Rental total (PHP)",
            type: "number",
            required: true,
          },
          {
            name: "initial",
            label: "Required initial amount (PHP)",
            type: "number",
            required: true,
          },
          {
            name: "accessStart",
            label: "Quoted access begins",
            type: "datetime-local",
            required: true,
          },
          {
            name: "accessEnd",
            label: "Quoted access ends",
            type: "datetime-local",
            required: true,
          },
          {
            name: "balanceDue",
            label: "Rental balance due",
            type: "datetime-local",
            required: true,
          },
          {
            name: "inclusions",
            label: "Itemized package and inclusions",
            required: true,
          },
        ]}
        submit="Send quote and hold space"
        onSubmit={(v) =>
          dispatch({
            type: "quote",
            id: b.id,
            eventStart: fromInput(v.eventStart),
            eventEnd: fromInput(v.eventEnd),
            total: pesos(v.total),
            initial: pesos(v.initial),
            accessStart: fromInput(v.accessStart),
            accessEnd: fromInput(v.accessEnd),
            balanceDue: fromInput(v.balanceDue),
            inclusions: v.inclusions,
          })
        }
      />
    </section>
  );
}
