"use client";
import { useRouter } from "next/navigation";
import { useDemo } from "@/demo/demo-provider";
import { RecordForm } from "@/components/shared/record-form";
import { RoleGate, Notice, ActionLink } from "@/components/shared/common";
import { localInput, fromInput } from "@/domain/time";
export function InquiryForm({ venueId }: { venueId: string }) {
  const { state, dispatch } = useDemo();
  const router = useRouter();
  const b = state.bookings.find((b) => b.id === "alex-celebration")!;
  const d = b.draft;
  const date = state.drafts.filters?.date || "2026-11-07";
  const toDraft = (v: Record<string, string>) => ({
    name: v.name,
    contact: v.contact,
    purpose: v.purpose,
    guests: Number(v.guests),
    start: fromInput(v.start),
    end: fromInput(v.end),
    accessStart: fromInput(v.accessStart),
    accessEnd: fromInput(v.accessEnd),
    package: v.package,
    needs: v.needs,
  });
  return (
    <RoleGate roles={["customer"]} identity="alex">
      <section className="panel" id="inquiry">
        <h2>Tell the venue about your occasion.</h2>
        {b.submitted ? (
          <>
            <Notice>
              Your inquiry is already on file. Continue on the same record.
            </Notice>
            <ActionLink href={`/bookings/${b.id}`}>View inquiry</ActionLink>
          </>
        ) : (
          <>
            <Notice>
              Sending creates an inquiry only. No hold and no payment. Use
              fictional contact information.
            </Notice>
            <RecordForm
              id="alex-inquiry"
              values={{
                name: d.name,
                contact: d.contact,
                purpose: d.purpose,
                guests: String(d.guests),
                start: date + "T10:00",
                end: date + "T18:00",
                accessStart: date + "T09:00",
                accessEnd: date + "T19:00",
                package: d.package,
                needs: d.needs,
              }}
              fields={[
                { name: "name", label: "Your name", required: true },
                {
                  name: "contact",
                  label: "Contact email",
                  type: "email",
                  required: true,
                },
                { name: "purpose", label: "Event purpose", required: true },
                {
                  name: "guests",
                  label: "Guest count",
                  type: "number",
                  required: true,
                },
                {
                  name: "start",
                  label: "Event starts (Philippine time)",
                  type: "datetime-local",
                  required: true,
                },
                {
                  name: "end",
                  label: "Event ends (Philippine time)",
                  type: "datetime-local",
                  required: true,
                },
                {
                  name: "accessStart",
                  label: "Setup access begins",
                  type: "datetime-local",
                  required: true,
                },
                {
                  name: "accessEnd",
                  label: "Cleanup access ends",
                  type: "datetime-local",
                  required: true,
                },
                { name: "package", label: "Preferred package", required: true },
                {
                  name: "needs",
                  label: "Additional needs",
                  type: "textarea",
                  full: true,
                },
              ]}
              submit="Send inquiry"
              onSubmit={(v) => {
                if (
                  !dispatch({
                    type: "saveInquiry",
                    id: b.id,
                    venueId,
                    draft: toDraft(v),
                  })
                )
                  return false;
                if (dispatch({ type: "submitInquiry", id: b.id })) {
                  router.push(`/bookings/${b.id}`);
                  return true;
                }
                return false;
              }}
            />
            <p className="small muted">
              Sample default access:{" "}
              {localInput(d.accessStart).replace("T", " ")} to{" "}
              {localInput(d.accessEnd).replace("T", " ")}.
            </p>
          </>
        )}
      </section>
    </RoleGate>
  );
}
