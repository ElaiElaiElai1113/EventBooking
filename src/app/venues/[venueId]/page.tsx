import { VenueDetails } from "@/features/venues/venue-details";
export default async function Page({
  params,
}: {
  params: Promise<{ venueId: string }>;
}) {
  return <VenueDetails id={(await params).venueId} />;
}
