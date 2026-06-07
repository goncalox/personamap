import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PersonaMap",
    template: "%s | PersonaMap",
  },
  description: "Evidence-based personality typing for characters and public figures.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
