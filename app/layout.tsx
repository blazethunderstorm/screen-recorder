import type { Metadata } from "next";
import { Karla } from "next/font/google";
import "./globals.css";

import { SessionProvider } from "next-auth/react";

const geistKarla = Karla({
  variable: "--font-geist-karla",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScreenPro",
  description: "A Screen Sharing App",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950"
      >
         <SessionProvider>
        {children}
        </SessionProvider>
      </body>
    </html>
  );
}
