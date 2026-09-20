"use client";
import { VenueGallery } from "./venue-gallery";
import { VenueCalendar } from "./venue-calendar";
import { MapPin, Users, Check } from "lucide-react";
import { useDemo } from "@/demo/demo-provider";
import { money } from "@/domain/money";
import { Back, PageHeading, Notice } from "@/components/shared/common";
import { Button } from "@/components/ui/button";

import { InquiryForm } from "./inquiry-form";
export function VenueDetails({ id }: { id: string }) {
  const { state, nav } = useDemo();
  const inquiry = state.navigation["inquiry-" + id] === "open";
  const v = state.venues.find((v) => v.id === id);
  if (!v)
    return (
      <div className="container">
        <PageHeading title="Venue not found" />
        <Back href="/venues">Browse venues</Back>
      </div>
    );
  return (
    <div className="container">
      <Back href="/venues">All venues</Back>
      <PageHeading
        eyebrow={`${v.area.toUpperCase()} · DAVAO CITY`}
        title={v.name}
        description={v.description}
      />
      <VenueGallery venue={v} />
      <div className="detail-grid">
        <section>
          <h2>A setting with room for your plans</h2>
          <div className="inline-facts">
            <span>
              <Users size={18} />
              Up to {v.capacity} guests
            </span>
            <span>
              <MapPin size={18} />
              {v.area}
            </span>
          </div>
          <p>{v.address}. Location and amenities are examples for this demo.</p>
          <div className="amenities">
            {v.amenities.map((x) => (
              <span key={x}>
                <Check size={18} />
                {x}
              </span>
            ))}
          </div>
          <h3>Getting here & access</h3>
          <p>{v.access}</p>
          <h3>Good to know</h3>
          <p>{v.restrictions}</p>
          <details className="venue-inclusions">
            <summary>What to include in your quote</summary>
            <h3>Listed sample facilities</h3>
            <ul>
              {v.amenities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3>Confirm separately</h3>
            <p>
              Catering, decor, sound equipment, staffing and furniture
              quantities are not promised by this starting price. Ask the venue
              to itemize the services you need.
            </p>
            <p>
              Include your preferred seating layout, step-free access needs and
              loading times. The venue confirms the final capacity and
              inclusions in its quote.
            </p>
          </details>
          <VenueCalendar key={id} venueId={id} />
        </section>
        <aside className="panel quote-card">
          <p className="eyebrow">MAKE IT YOUR OCCASION</p>
          <h2>
            <small>From</small>{" "}
            {money(v.price).replace("PHP", "₱").replace(/\.00$/, "")}
          </h2>
          <p>
            Illustrative starting price for whole-venue use, not a per-person
            rate. Your dates, access hours and requested services determine the
            final quote.
          </p>
          <Notice>No payment or reservation when you inquire.</Notice>
          <Button
            onClick={() => {
              nav("inquiry-" + id, "open");
              requestAnimationFrame(() =>
                document
                  .getElementById("inquiry")
                  ?.scrollIntoView({ block: "start" }),
              );
            }}
          >
            Request a quote
          </Button>
        </aside>
      </div>
      {inquiry && (
        <div style={{ marginTop: 32 }}>
          <InquiryForm venueId={id} />
        </div>
      )}
    </div>
  );
}
