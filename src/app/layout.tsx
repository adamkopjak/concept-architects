import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Concept Architects — Residential Architecture for Considered Living",
  description:
    "Concept Architects is an independent studio designing private residences, ateliers and retreats with restraint, craft and conviction.",
  icons: { icon: "data:," },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
