import { Roster } from "@/features/payments/roster";
import { notFound } from "next/navigation";
export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  if ((await params).eventId !== "makers-market-2026") notFound();
  return <Roster />;
}
