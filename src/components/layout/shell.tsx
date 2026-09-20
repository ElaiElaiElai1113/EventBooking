"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flower2, ArrowUpRight } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useDemo } from "@/demo/demo-provider";
import { PresenterControls } from "@/demo/presenter-controls";
export function Shell({ children }: { children: ReactNode }) {
  const { state, error, clearError, saved, nav } = useDemo();
  const path = usePathname();
  useEffect(() => {
    if (path !== "/" && state.navigation.route !== path) nav("route", path);
  }, [path, state.navigation.route, nav]);
  useEffect(() => {
    document.querySelector<HTMLElement>("h1")?.focus();
  }, [path]);
  const privateLinks =
    state.role === "venue"
      ? [
          ["/venue/requests", "Requests & calendar"],
          ["/venue/events/makers-market-2026/review", "Event review"],
        ]
      : state.role === "organizer"
        ? [
            ["/organizer/events", "My events"],
            [
              "/organizer/events/makers-market-2026/applications",
              "Applications",
            ],
            ["/organizer/events/makers-market-2026/roster", "Roster"],
          ]
        : state.role === "merchant"
          ? [[`/applications/${state.identity}`, "My application"]]
          : [["/bookings/alex-celebration", "My inquiry"]];
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <PresenterControls />
      <header className="site-header">
        <Link className="brand" href="/">
          <Flower2 size={28} strokeWidth={1.4} />
          <span>
            Davao<span className="brand-small">EVENT PLATFORM</span>
          </span>
        </Link>
        <nav aria-label="Main navigation">
          <Link
            className={path.startsWith("/venues") ? "active" : ""}
            href="/venues"
          >
            Find a venue
          </Link>
          <Link href="/events/makers-market-2026">For merchants</Link>
          {privateLinks.map(([href, title]) => (
            <Link key={href} href={href}>
              {title}
            </Link>
          ))}
        </nav>
        <span className="identity">
          {state.role === "merchant"
            ? state.profiles.find((p) => p.id === state.identity)?.name
            : state.role === "customer"
              ? "Alex"
              : state.role === "venue"
                ? "Venue workspace"
                : "Sample Market Team"}
          <ArrowUpRight size={14} />
        </span>
      </header>
      {error && (
        <div className="global-error" role="alert">
          <span>{error}</span>
          <button onClick={clearError} aria-label="Dismiss error">
            ×
          </button>
        </div>
      )}
      <main id="main">{children}</main>
      <footer className="site-footer">
        <span>
          Davao Event Platform <span className="muted">· Temporary name</span>
        </span>
        <span>
          Fictional venues. Illustrative prices. No real transactions.
        </span>
        <span role="status">{saved}</span>
      </footer>
    </>
  );
}
