import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "ApexUT — Basketball Performance Tracker",
  description: "Suivi des performances basket, Top 5 UT et stats détaillées pour chaque joueur.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#1C1917", color: "#F5F5F4" }}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
