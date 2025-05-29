import type { Metadata } from "next";

import "./globals.css";


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
      >
        {children}
      </body>
    </html>
  );
}
