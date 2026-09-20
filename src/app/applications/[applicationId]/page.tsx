import { ApplicationDetail } from "@/features/applications/application-detail";
export default async function Page({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  return <ApplicationDetail id={(await params).applicationId} />;
}
