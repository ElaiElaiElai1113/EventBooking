"use client";
import { useRouter } from "next/navigation";
import { MapPin, Store, CalendarDays, ArrowRight } from "lucide-react";
import { useDemo } from "@/demo/demo-provider";
import { PageHeading, ActionLink } from "@/components/shared/common";
import { Button } from "@/components/ui/button";
import { VenueImage } from "@/components/shared/venue-image";
export default function HomePage() {
  const { state, load } = useDemo();
  const router = useRouter();
  const begin = (scene: string, path: string) => {
    if (
      confirm("Load this journey and replace the current fictional scene?") &&
      load(scene)
    )
      router.push(path);
  };
  return (
    <div className="container welcome-page">
      <div className="market-heading">
        <span className="gathering-mark" aria-hidden="true">
          ✳
        </span>
        <PageHeading
          eyebrow="DAVAO EVENT PLATFORM · LOCAL DEMONSTRATION"
          title="Good gatherings start with a place."
          description="Find the setting. Bring your market to life. Make space for independent businesses. Explore three connected journeys with fictional Davao City examples."
        />
      </div>
      <div className="journey-grid">
        <article className="journey-card">
          <div className="journey-art">
            <VenueImage
              src="/demo/garden.jpg"
              alt="Illustrative garden celebration, not a real listed venue"
              fill
              preload
              sizes="(max-width: 700px) 90vw, 30vw"
            />
            <span className="photo-caption">Find your kind of gathering</span>
          </div>
          <MapPin size={28} />
          <h2>Find your venue.</h2>
          <p>
            Explore three sample spaces, inquire, agree a quote and see how
            venue verification confirms a booking.
          </p>
          <Button onClick={() => begin("venue-inquiry", "/venues")}>
            Start venue journey
            <ArrowRight size={16} />
          </Button>
        </article>
        <article className="journey-card">
          <div className="journey-art">
            <VenueImage
              src="/demo/hall.jpg"
              alt="Illustrative hall setting, not a real listed venue"
              fill
              sizes="(max-width: 700px) 90vw, 30vw"
            />
            <span className="photo-caption">
              Make a little room for big ideas
            </span>
          </div>
          <CalendarDays size={28} />
          <h2>Bring a market to life.</h2>
          <p>
            Prepare the event, agree the current layout with the venue and
            publish clear merchant terms.
          </p>
          <Button
            onClick={() =>
              begin("event-setup", "/organizer/events/makers-market-2026/setup")
            }
          >
            Start organizer journey
            <ArrowRight size={16} />
          </Button>
        </article>
        <article className="journey-card">
          <div className="journey-art product-art">
            <VenueImage
              src="/demo/products.svg"
              alt="Original illustration of sample handmade products"
              fill
              sizes="(max-width: 700px) 90vw, 30vw"
            />
            <span className="photo-caption">Good things, made by you</span>
          </div>
          <Store size={28} />
          <h2>Find your next market.</h2>
          <p>
            Apply once with ranked booth options. Follow an exact offer through
            receipt verification and confirmation.
          </p>
          <Button
            onClick={() =>
              begin("merchant-entry", "/events/makers-market-2026")
            }
          >
            Start merchant journey
            <ArrowRight size={16} />
          </Button>
        </article>
      </div>
      <div className="market-foot">
        <p>
          Current scene: {state.scene}
          <br />
          Starting a journey explicitly replaces the scene. Ordinary navigation
          preserves work.
        </p>
        <ActionLink href={state.navigation.route ?? "/venues"}>
          Continue current scene
        </ActionLink>
      </div>
    </div>
  );
}
