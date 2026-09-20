import { EventSetup } from "@/features/events/event-setup";
import { notFound } from "next/navigation";
export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  if ((await params).eventId !== "makers-market-2026") notFound();
  return <EventSetup />;
}
