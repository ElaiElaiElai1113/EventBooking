"use client";
import Image from "next/image";
import { useState, type ComponentProps } from "react";
export function VenueImage(props: ComponentProps<typeof Image>) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div className="image-fallback" role="img" aria-label={props.alt}>
      Illustrative photo unavailable. Venue details remain below.
    </div>
  ) : (
    <Image {...props} alt={props.alt} onError={() => setFailed(true)} />
  );
}
