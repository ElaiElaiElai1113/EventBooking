import { BookingDetail } from "@/features/venues/booking-detail";
export default async function Page({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  return <BookingDetail id={(await params).bookingId} />;
}
