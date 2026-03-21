import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LiveCanvas — Real-time Collaborative Drawing",
  description:
    "A real-time multiplayer drawing canvas for brainstorming, diagramming, and sketching ideas together.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#1e1e2e] text-[#cdd6f4] antialiased">
        {children}
      </body>
    </html>
  );
}
