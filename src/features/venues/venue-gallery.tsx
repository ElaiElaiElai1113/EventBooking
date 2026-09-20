"use client";
import { useState } from "react";
import type { Venue } from "@/domain/model";
import { VenueImage } from "@/components/shared/venue-image";

const views = ["Setting", "Seated gathering", "Market layout"];
export function VenueGallery({ venue }: { venue: Venue }) {
  const [view, setView] = useState(0);
  return (
    <section className="venue-gallery" aria-label="Venue gallery">
      <div className="detail-photo gallery-stage">
        {view === 0 ? (
          <VenueImage
            key={venue.image}
            src={venue.image}
            alt={`Illustrative event setting for ${venue.name}; not a real listed property`}
            fill
            preload
            sizes="(max-width: 1320px) 94vw, 1280px"
          />
        ) : (
          <svg
            viewBox="0 0 760 360"
            role="img"
            aria-label={`${views[view]} concept for ${venue.name}. Schematic only, not to scale or an approved floor plan.`}
          >
            <rect width="760" height="360" fill="#e9ede3" />
            <rect
              x="100"
              y="28"
              width="560"
              height="282"
              rx={venue.id === "sample-garden" ? 70 : 12}
              fill="#f7f6f1"
              stroke="#7c877e"
              strokeWidth="2"
            />
            <rect
              x="315"
              y="35"
              width="130"
              height="35"
              rx="6"
              fill="#23352b"
            />
            <text x="380" y="58" textAnchor="middle" fill="white" fontSize="15">
              {view === 1 ? "Gathering point" : "Welcome area"}
            </text>
            {view === 1
              ? [190, 310, 450, 570].flatMap((x) =>
                  [130, 240].map((y) => (
                    <g key={`${x}-${y}`}>
                      <circle
                        cx={x}
                        cy={y}
                        r="30"
                        fill="#d9dfcb"
                        stroke="#7c877e"
                      />
                      {[0, 90, 180, 270].map((a) => (
                        <circle
                          key={a}
                          cx={x + 43 * Math.cos((a * Math.PI) / 180)}
                          cy={y + 43 * Math.sin((a * Math.PI) / 180)}
                          r="7"
                          fill="#a84c32"
                        />
                      ))}
                    </g>
                  )),
                )
              : [160, 240, 320, 440, 520, 600].flatMap((x) =>
                  [115, 245].map((y) => (
                    <rect
                      key={`${x}-${y}`}
                      x={x - 25}
                      y={y - 20}
                      width="50"
                      height="40"
                      rx="4"
                      fill="#d9dfcb"
                      stroke="#7c877e"
                    />
                  )),
                )}
            {view === 2 && (
              <text
                x="380"
                y="186"
                textAnchor="middle"
                fill="#23352b"
                fontSize="17"
              >
                Keep the central aisle clear
              </text>
            )}
            <path d="M350 310h60" stroke="#a84c32" strokeWidth="5" />
            <text
              x="380"
              y="337"
              textAnchor="middle"
              fill="#23352b"
              fontSize="16"
            >
              Illustrative entrance
            </text>
          </svg>
        )}
        <span className="photo-caption">
          {view === 0
            ? "Illustrative stock photo · Fictional venue"
            : "Layout concept · Not to scale · Subject to venue review"}
        </span>
      </div>
      <div className="gallery-controls" aria-label="Gallery views">
        {views.map((label, i) => (
          <button
            key={label}
            aria-pressed={view === i}
            onClick={() => setView(i)}
          >
            <span className="small">0{i + 1}</span>
            {label}
          </button>
        ))}
      </div>
      {view > 0 && (
        <p className="small muted" role="status">
          {view === 1
            ? "A seated celebration concept. Final seating capacity depends on tables, aisles and access needs."
            : "A market concept with a clear circulation aisle. Booth count and dimensions must be agreed separately."}{" "}
          This illustration is not the market edition’s approved booth map.
        </p>
      )}
    </section>
  );
}
