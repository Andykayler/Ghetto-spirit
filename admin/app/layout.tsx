import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ghetto Spirit - Admin",
  description: "Entertainment Platform Admin Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-[#0A0A0A] antialiased">
        {children}
      </body>
    </html>
  );
}