import { OrganizerReview } from "@/features/applications/organizer-review";
import { notFound } from "next/navigation";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ application?: string }>;
}) {
  if ((await params).eventId !== "makers-market-2026") notFound();
  return (
    <OrganizerReview initialApplication={(await searchParams).application} />
  );
}
