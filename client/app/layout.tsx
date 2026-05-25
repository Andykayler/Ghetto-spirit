import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ghetto Spirit Entertainment",
  description: "From the streets to the stage. Raw Talent. Real Culture. Bigger Dreams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
