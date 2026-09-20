"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useDemo } from "@/demo/demo-provider";
import type { Role, Terms } from "@/domain/model";
import { Button } from "@/components/ui/button";
import { dateTime } from "@/domain/time";
export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 tabIndex={-1}>{title}</h1>
        {description && <p className="lead">{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function Status({ children }: { children: ReactNode }) {
  return <span className="status">{children}</span>;
}
export function Notice({ children }: { children: ReactNode }) {
  return <div className="notice">{children}</div>;
}
export function Back({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link className="back" href={href}>
      <ArrowLeft size={16} />
      {children}
    </Link>
  );
}
export function ActionLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Button asChild>
      <Link href={href}>
        {children}
        <ArrowRight size={16} />
      </Link>
    </Button>
  );
}
export function RoleGate({
  roles,
  identity,
  children,
}: {
  roles: Role[];
  identity?: string;
  children: ReactNode;
}) {
  const { state } = useDemo();
  if (!roles.includes(state.role) || (identity && state.identity !== identity))
    return (
      <section className="container narrow">
        <PageHeading
          title="Switch demo perspective"
          description={`This private view belongs to ${roles.join(" or ")}${identity ? " · " + identity : ""}.`}
        />
        <Notice>
          Use Demo controls to switch role or identity. This is a presentation
          boundary, not real authentication.
        </Notice>
        <Back href="/">Return to demo home</Back>
      </section>
    );
  return children;
}
export function TermsView({ terms }: { terms: Terms }) {
  return (
    <div className="terms">
      <h3>
        Payment & cancellation terms{" "}
        <span className="muted">v{terms.version}</span>
      </h3>
      <p>
        {terms.mode === "deposit"
          ? `${terms.percent}% deposit, remaining balance due ${dateTime(terms.balanceDue)}.`
          : "Full payment is required within the offer window."}{" "}
        The 48-hour merchant window includes acceptance and submission of the
        initial payment.
      </p>
      <p>{terms.withdrawal}</p>
      <details>
        <summary>All illustrative policy details</summary>
        <p>{terms.organizerCancellation}</p>
        <p>{terms.missedBalance}</p>
        <p>{terms.instructions}</p>
      </details>
    </div>
  );
}
export function History({ items }: { items: string[] }) {
  return (
    <details className="history">
      <summary>Activity & version history ({items.length})</summary>
      {items.length ? (
        items.map((x, i) => <p key={i}>{x}</p>)
      ) : (
        <p>No activity yet.</p>
      )}
    </details>
  );
}
