import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { DemoProvider } from "@/demo/demo-provider";
import { Shell } from "@/components/layout/shell";
const sans = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/dm-sans/files/dm-sans-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/dm-sans/files/dm-sans-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--demo-sans",
  display: "swap",
  preload: true,
});
const display = localFont({
  src: "../../node_modules/@fontsource/fraunces/files/fraunces-latin-400-normal.woff2",
  variable: "--demo-display",
  weight: "400",
  display: "swap",
  preload: true,
});
export const metadata = {
  title: "Davao Event Platform — Demo",
  description: "Fictional local venue and event demonstration.",
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body>
        <DemoProvider>
          <Shell>{children}</Shell>
        </DemoProvider>
      </body>
    </html>
  );
}
