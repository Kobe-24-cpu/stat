"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Hero() {
  const [joueurs, setJoueurs] = useState(0);
  const [matchs, setMatchs]   = useState(0);

  useEffect(() => {
    async function chargerCompteurs() {
      const { count: nbJoueurs } = await supabase
        .from("joueurs")
        .select("*", { count: "exact", head: true });
      const { count: nbStats } = await supabase
        .from("stats")
        .select("*", { count: "exact", head: true });
      if (nbJoueurs !== null) setJoueurs(nbJoueurs);
      if (nbStats   !== null) setMatchs(nbStats);
    }
    chargerCompteurs();
  }, []);

  return (
    <section style={{
      position: "relative", width: "100%", height: "80vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", backgroundColor: "#1C1917",
      backgroundImage: "url('/images/photo8.jpeg')",
      backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
    }}>
      {/* Overlay */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(28, 25, 23, 0.75)", zIndex: 1 }} />

      {/* Contenu */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 800, padding: "0 20px" }}>
        <span style={{ color: "#F97316", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", marginBottom: 15, display: "inline-block" }}>
          Domine ton jeu • Analyse tes stats
        </span>

        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(42px, 6vw, 72px)", fontWeight: 900, color: "#F5F5F4", lineHeight: 1, margin: "0 0 20px 0", letterSpacing: 1, textTransform: "uppercase" }}>
          PROPULSE TON BASKETBALL DANS <span style={{ color: "#F97316" }}>UNE AUTRE DIMENSION</span>
        </h1>

        <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#A8A29E", fontSize: "clamp(15px, 2vw, 19px)", lineHeight: 1.6, maxWidth: 650, margin: "0 auto 40px auto" }}>
          Suis tes performances à chaque match, compare tes progressions avec les meilleurs joueurs de la ligue et obtiens les conseils tactiques personnalisés de notre Coach IA.
        </p>

        {/* Boutons */}
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
          <Link href="/top5" style={{ background: "#F97316", color: "white", padding: "16px 32px", borderRadius: 10, textDecoration: "none", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 900, letterSpacing: 1, boxShadow: "0 10px 20px rgba(249,115,22,0.2)" }}>
            🏆 VOIR LE TOP 5 IA
          </Link>
          <Link href="/joueurs" style={{ background: "transparent", color: "#F5F5F4", padding: "16px 32px", borderRadius: 10, textDecoration: "none", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 900, letterSpacing: 1, border: "2px solid rgba(255,255,255,0.2)" }}>
            🏀 REJOINDRE LA LIGUE
          </Link>
        </div>
      </div>
    </section>
  );
}
