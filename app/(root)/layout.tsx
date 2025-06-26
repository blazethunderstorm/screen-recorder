// app/layout.tsx (or your root layout file)
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar/>
          {children}
          </SessionProvider>
        
      </body>
    </html>
  );
}