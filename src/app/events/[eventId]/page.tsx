import { notFound } from "next/navigation";
import { EventPublic } from "@/features/events/event-public";
export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  if ((await params).eventId !== "makers-market-2026") notFound();
  return <EventPublic />;
}
