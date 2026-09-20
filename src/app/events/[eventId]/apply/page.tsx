import { MerchantForm } from "@/features/applications/merchant-form";
import { notFound } from "next/navigation";
export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  if ((await params).eventId !== "makers-market-2026") notFound();
  return <MerchantForm />;
}
