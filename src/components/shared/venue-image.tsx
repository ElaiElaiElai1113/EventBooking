"use client";
import Image from "next/image";
import { useState, type ComponentProps } from "react";
export function VenueImage(props: ComponentProps<typeof Image>) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return failed ? (
    <div className="image-fallback" role="img" aria-label={props.alt}>
      Illustrative photo unavailable. Venue details remain below.
    </div>
  ) : (
    <>
      <Image
        {...props}
        alt={props.alt}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
      {!loaded && (
        <span className="image-loading" aria-hidden="true">
          Loading setting…
        </span>
      )}
    </>
  );
}
