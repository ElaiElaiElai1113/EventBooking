import type { ReactNode } from "react";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/fraunces/400.css";
import "./globals.css";
import { DemoProvider } from "@/demo/demo-provider";
import { Shell } from "@/components/layout/shell";
export const metadata = {
  title: "Davao Event Platform — Demo",
  description: "Fictional local venue and event demonstration.",
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DemoProvider>
          <Shell>{children}</Shell>
        </DemoProvider>
      </body>
    </html>
  );
}
