"use client";
import { VenueImage } from "@/components/shared/venue-image";
import Link from "next/link";
import { MapPin, Users, ArrowUpRight, Search } from "lucide-react";
import { useDemo } from "@/demo/demo-provider";
import { money } from "@/domain/money";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/shared/common";
export function VenueCatalog() {
  const { state, draft } = useDemo();
  const f = state.drafts.filters ?? {
    area: "",
    guests: "",
    date: "2026-11-07",
  };
  const update = (key: string, value: string) =>
    draft("filters", { ...f, [key]: value });
  const venues = state.venues.filter(
    (v) =>
      (!f.area || v.area === f.area) && v.capacity >= Number(f.guests || 0),
  );
  return (
    <div className="container">
      <div className="market-heading">
        <PageHeading
          eyebrow="GOOD PLACES. GREAT GATHERINGS."
          title="A place for your next occasion."
          description="Explore spaces in Davao City. Find the right setting, share your plans, and work out the details with the venue."
        />
        <span className="editorial-note">
          Bring your
          <br />
          <em>people together.</em>
        </span>
      </div>
      <div className="search-bar">
        <label>
          <MapPin size={17} /> Area
          <select
            value={f.area}
            onChange={(e) => update("area", e.target.value)}
          >
            <option value="">All Davao City areas</option>
            {state.venues.map((v) => (
              <option key={v.area}>{v.area}</option>
            ))}
          </select>
        </label>
        <label>
          <Users size={17} /> Guests
          <input
            type="number"
            min="1"
            placeholder="How many people?"
            value={f.guests}
            onChange={(e) => update("guests", e.target.value)}
          />
        </label>
        <label>
          Preferred date
          <input
            type="date"
            value={f.date}
            onChange={(e) => update("date", e.target.value)}
          />
        </label>
        <div className="search-icon" aria-hidden="true">
          <Search size={22} />
        </div>
      </div>
      <div className="section-label">
        <h2>Spaces to make your own</h2>
        <span>
          {venues.length} fictional {venues.length === 1 ? "venue" : "venues"}
        </span>
      </div>
      <div className="venue-grid">
        {venues.map((v, i) => (
          <article className="venue-card" key={v.id}>
            <Link href={`/venues/${v.id}`} className="venue-photo">
              <VenueImage
                src={v.image}
                alt={`Illustrative ${v.name === "Sample Garden" ? "garden celebration" : v.name === "Sample Hall" ? "indoor reception hall" : "covered event setting"}; not a Davao property`}
                fill
                sizes="(max-width: 700px) 100vw, 33vw"
                priority={i === 0}
              />
              <span className="photo-caption">Illustrative imagery</span>
              <span className="photo-link">
                <ArrowUpRight size={22} />
              </span>
            </Link>
            <div className="venue-meta">
              <span>
                <MapPin size={14} />
                {v.area}, Davao City
              </span>
              <span>Up to {v.capacity} guests</span>
            </div>
            <h2>
              <Link href={`/venues/${v.id}`}>{v.name}</Link>
            </h2>
            <p>{v.description}</p>
            <div className="venue-bottom">
              <span>
                From <strong>{money(v.price)}</strong>
                <small>Illustrative whole-venue price</small>
              </span>
              <Link aria-label={`View ${v.name}`} href={`/venues/${v.id}`}>
                <ArrowUpRight size={22} />
              </Link>
            </div>
          </article>
        ))}
      </div>
      {!venues.length && (
        <div className="empty">
          <h2>No sample venues match</h2>
          <p>
            Try fewer guests or a different area. Your preferred date is kept.
          </p>
          <Button
            onClick={() => draft("filters", { ...f, area: "", guests: "" })}
          >
            Clear filters
          </Button>
        </div>
      )}
      <div className="market-foot">
        <span>
          01 <strong>Find a setting</strong>
        </span>
        <span>
          02 <strong>Send an inquiry</strong>
        </span>
        <span>
          03 <strong>Agree the details</strong>
        </span>
        <p>
          An inquiry starts a conversation.
          <br />
          Only verified payment confirms a booking.
        </p>
      </div>
    </div>
  );
}
