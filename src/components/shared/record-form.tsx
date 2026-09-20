"use client";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDemo } from "@/demo/demo-provider";
import { Button } from "@/components/ui/button";
export type Field = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  full?: boolean;
  help?: string;
};
export function RecordForm({
  id,
  fields,
  values,
  onSubmit,
  submit = "Save changes",
  onDraft,
}: {
  id: string;
  fields: Field[];
  values: Record<string, string>;
  onSubmit: (v: Record<string, string>) => boolean | void;
  submit?: string;
  onDraft?: (v: Record<string, string>) => void;
}) {
  const { state, draft, saved } = useDemo();
  const prefix = useId();
  const schema = z.record(z.string()).superRefine((data, ctx) => {
    for (const f of fields) {
      const value = data[f.name] ?? "";
      if (f.required && !value.trim())
        ctx.addIssue({
          code: "custom",
          path: [f.name],
          message: `${f.label} is required.`,
        });
      if (
        value &&
        f.type === "email" &&
        !z.string().email().safeParse(value).success
      )
        ctx.addIssue({
          code: "custom",
          path: [f.name],
          message: "Enter a valid sample email address.",
        });
      if (
        value &&
        f.type === "number" &&
        (!Number.isFinite(Number(value)) || Number(value) < 0)
      )
        ctx.addIssue({
          code: "custom",
          path: [f.name],
          message: "Enter a nonnegative number.",
        });
    }
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Record<string, string>>({
    defaultValues: { ...values, ...state.drafts[id] },
    resolver: zodResolver(schema),
  });
  return (
    <form
      noValidate
      onChange={() => {
        const v = getValues();
        draft(id, v);
        onDraft?.(v);
      }}
      onSubmit={handleSubmit((v) => onSubmit(v))}
    >
      {Object.keys(errors).length > 0 && (
        <div className="error" role="alert">
          <strong>Check the highlighted fields.</strong>
          {fields
            .filter((f) => errors[f.name])
            .map((f) => (
              <p key={f.name}>
                <a href={`#${prefix}-${f.name}`}>
                  {String(errors[f.name]?.message)}
                </a>
              </p>
            ))}
        </div>
      )}
      <div className="form-grid">
        {fields.map((f) => (
          <div key={f.name} className={f.full ? "full" : ""}>
            <label htmlFor={`${prefix}-${f.name}`}>
              {f.label}
              {!f.required && <span className="muted"> · optional</span>}
            </label>
            {f.options ? (
              <select
                id={`${prefix}-${f.name}`}
                aria-label={f.label}
                aria-describedby={
                  errors[f.name] ? `${prefix}-${f.name}-error` : undefined
                }
                {...register(f.name)}
              >
                {f.options.map((o) => (
                  <option value={o.value} key={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : f.type === "textarea" ? (
              <textarea
                id={`${prefix}-${f.name}`}
                aria-label={f.label}
                aria-describedby={
                  errors[f.name] ? `${prefix}-${f.name}-error` : undefined
                }
                aria-invalid={!!errors[f.name]}
                {...register(f.name)}
              />
            ) : (
              <input
                id={`${prefix}-${f.name}`}
                aria-label={f.label}
                aria-describedby={
                  errors[f.name] ? `${prefix}-${f.name}-error` : undefined
                }
                type={f.type ?? "text"}
                aria-invalid={!!errors[f.name]}
                {...register(f.name)}
              />
            )}{" "}
            {f.help && <p className="small muted">{f.help}</p>}
            {errors[f.name] && (
              <p id={`${prefix}-${f.name}-error`} className="field-error">
                {String(errors[f.name]?.message)}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="form-actions">
        <span className="small muted">
          {saved.startsWith("Not saved")
            ? "Not saved — changes are only in memory."
            : "Changes kept in this browser."}
        </span>
        <Button type="submit">{submit}</Button>
      </div>
    </form>
  );
}
