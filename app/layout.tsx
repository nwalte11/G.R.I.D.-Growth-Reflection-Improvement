import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "G.R.I.D. - Growth Reflection Improvement Dashboard",
  description: "Track and improve your cognitive, physical, and psychological growth with personalized AI-powered assessments",
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
