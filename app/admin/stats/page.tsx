"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Hero from "@/components/ui/Hero";

interface Joueur {
  id: string;
  nom: string;
  prenom: string;
  numero: string;
  poste: "Meneur" | "Arrière" | "Ailier" | "Ailier Fort" | "Pivot";
}

interface MatchStat {
  id: string;
  joueurId: string;
  points: number;
  passes: number;
  rebonds: number;
  interceptions: number;
  contres: number;
  turnovers: number;
  date: string;
}

interface MediaItem {
  id: string;
  type: "video" | "photo";
  src: string;
  title: string;
}

const POSTE_COLORS: Record<string, string> = {
  Meneur: "#A78BFA",
  Arrière: "#5EEAD4",
  Ailier: "#93C5FD",
  "Ailier Fort": "#FCA5A5",
  Pivot: "#FB923C",
};

function avg(
  stats: MatchStat[],
  joueurId: string,
  key: "points" | "passes" | "rebonds" | "interceptions" | "contres" | "turnovers"
): string {
  const s = stats.filter((m) => m.joueurId === joueurId);
  if (!s.length) return "0.0";
  return (s.reduce((sum, m) => sum + (m[key] || 0), 0) / s.length).toFixed(1);
}

export default function Home() {
  const [joueurs, setJoueurs] = useState<Joueur[]>([]);
  const [stats, setStats] = useState<MatchStat[]>([]);
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);

  const videos: MediaItem[] = [
    { id: "v1", type: "video", src: "/videos/VideoApexUT.mp4", title: "Dribble & Cross" },
    { id: "v2", type: "video", src: "/videos/VideoApexUT4.mp4", title: "Shoot Parfait Swish" },
    { id: "v3", type: "video", src: "/videos/VideoApexUT6.mp4", title: "Perfect Dribble" },
    { id: "v4", type: "video", src: "/videos/VideoApexUT7.mp4", title: "Contre-attaque Rapide" },
    { id: "v5", type: "video", src: "/videos/VideoApexUT2.mp4", title: "Sans Pression" },
    { id: "v6", type: "video", src: "/videos/VideoApexUT5.mp4", title: "Filet en mouvement" },
    { id: "v7", type: "video", src: "/videos/VideoApexUT8.mp4", title: "Focus & Esprit d'équipe" },
    { id: "v8", type: "video", src: "/videos/VideoApexUT3.mp4", title: "Concentration" }
  ];

  const photos: MediaItem[] = [
    { id: "p1", type: "photo", src: "/images/photo2.jpeg", title: "Shoot en suspension" },
    { id: "p2", type: "photo", src: "/images/photo7.jpeg", title: "Belle vue" },
    { id: "p3", type: "photo", src: "/images/photo5.jpeg", title: "Focus Lancer Franc" },
    { id: "p4", type: "photo", src: "/images/photo1.jpeg", title: "Texture du Ballon" },
    { id: "p5", type: "photo", src: "/images/photo3.jpeg", title: "Aura Farming" },
    { id: "p6", type: "photo", src: "/images/photo4.jpeg", title: "Snipper" },
    { id: "p7", type: "photo", src: "/images/photo6.jpeg", title: "Chill Boy" },
  ];

  useEffect(() => {
    const j = localStorage.getItem("hoop_joueurs");
    const s = localStorage.getItem("hoop_stats");
    if (j) setJoueurs(JSON.parse(j));
    if (s) setStats(JSON.parse(s));
  }, []);

  return (
    /* LE BOUCLIER : width 100% + overflowX hidden empêche tout mouvement latéral sur mobile */
    <div style={{ width: "100%", overflowX: "hidden", background: "#1C1917", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#F5F5F4" }}>

      {/* ── HERO ── */}
      <Hero />

      {/* ── SECTION MÉDIAS DYNAMIQUE COMPATIBLE SMARTPHONE ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 60px" }}>
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 900, marginBottom: 4, letterSpacing: 1 }}>
         🎬 HIGHLIGHTS <span style={{ color: "#F97316" }}>APEXUT</span>
        </h2>
        <p style={{ fontSize: 14, color: "#78716C", marginBottom: 24 }}>
          Sur mobile, glisse vers la droite pour faire défiler la galerie. Clique sur un média pour le plein écran.
        </p>

        <div className="media-gallery-container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {videos.map((vid, idx) => (
            <div key={vid.id} onClick={() => setActiveMedia(vid)} className="media-card" style={{ position: "relative", height: 240, background: "#2C2925", borderRadius: 14, overflow: "hidden", cursor: "pointer", border: "1px solid rgba(249,115,22,0.1)", transition: "transform 0.2s", flexShrink: 0 }}>
              <video src={vid.src} muted playsInline loop autoPlay style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75 }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", display: "flex", flexDirection: "column", justifyContent: "end", padding: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#F97316", letterSpacing: 1 }}>VIDÉO {idx + 1}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#F5F5F4" }}>{vid.title}</span>
              </div>
              <span style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.6)", padding: "4px 8px", borderRadius: 20, fontSize: 11 }}>🎬 4K</span>
            </div>
          ))}

          {photos.map((pic, idx) => (
            <div key={pic.id} onClick={() => setActiveMedia(pic)} className="media-card" style={{ position: "relative", height: 240, background: "#2C2925", borderRadius: 14, overflow: "hidden", cursor: "pointer", border: "1px solid rgba(255,255,255,0.05)", transition: "transform 0.2s", flexShrink: 0 }}>
              <img src={pic.src} alt={pic.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", display: "flex", flexDirection: "column", justifyContent: "end", padding: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#78716C", letterSpacing: 1 }}>PHOTO {idx + 1}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#F5F5F4" }}>{pic.title}</span>
              </div>
              <span style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.6)", padding: "4px 8px", borderRadius: 20, fontSize: 11 }}>📸 HD</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── MODAL LIGHTBOX PLEIN ÉCRAN ── */}
      {activeMedia && (
        <div onClick={() => setActiveMedia(null)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(12, 10, 9, 0.95)", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, backdropFilter: "blur(8px)" }}>
          <button onClick={() => setActiveMedia(null)} style={{ position: "absolute", top: 24, right: 24, background: "rgba(255,255,255,0.1)", border: "none", color: "white", fontSize: 24, width: 50, height: 50, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 }}>✕</button>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "100%", maxHeight: "70vh", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", borderRadius: 12, overflow: "hidden", backgroundColor: "#1C1917" }}>
            {activeMedia.type === "video" ? (
              <video src={activeMedia.src} controls autoPlay style={{ width: "100%", maxHeight: "70vh", display: "block" }} />
            ) : (
              <img src={activeMedia.src} alt={activeMedia.title} style={{ width: "100%", maxHeight: "70vh", objectFit: "contain", display: "block" }} />
            )}
          </div>
          <div style={{ marginTop: 20, textAlign: "center", padding: "0 20px" }}>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 800, color: "#F97316", margin: "0 0 4px 0" }}>{activeMedia.title.toUpperCase()}</h3>
            <p style={{ color: "#78716C", fontSize: 14, margin: 0 }}>Mode Cinéma ApexUT — Cliquez en dehors pour quitter</p>
          </div>
        </div>
      )}

      {/* ── EFFECTIF ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 900 }}>EFFECTIF</h2>
            <p style={{ fontSize: 14, color: "#78716C", marginTop: 4 }}>{joueurs.length} joueur{joueurs.length !== 1 ? "s" : ""} enregistré{joueurs.length !== 1 ? "s" : ""}</p>
          </div>
          <Link href="/joueurs" style={{ fontSize: 13, color: "#F97316", textDecoration: "none", fontWeight: 600, border: "1px solid rgba(249,115,22,0.3)", padding: "8px 16px", borderRadius: 8 }}>
            + Ajouter un joueur
          </Link>
        </div>

        {joueurs.length === 0 ? (
          <div style={{ background: "#2C2925", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 16, padding: 60, textAlign: "center" }}>
            <p style={{ fontSize: 40, marginBottom: 16 }}>🏀</p>
            <p style={{ color: "#78716C", fontSize: 16 }}>Aucun joueur enregistré pour le moment.</p>
            <Link href="/joueurs" style={{ display: "inline-block", marginTop: 20, background: "#F97316", color: "white", padding: "10px 24px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, letterSpacing: 1 }}>
              INSCRIRE LE PREMIER JOUEUR
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {joueurs.map((j) => (
              <div key={j.id} style={{ background: "#2C2925", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#FED7AA", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 18, color: "#C2410C", flexShrink: 0 }}>
                  {j.prenom[0] || ""}{j.nom[0] || ""}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{j.prenom} {j.nom}</div>
                  <div style={{ marginTop: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: `${POSTE_COLORS[j.poste] || "#444"}22`, color: POSTE_COLORS[j.poste] || "#fff", textTransform: "uppercase", letterSpacing: 0.5 }}>{j.poste}</span>
                    <span style={{ fontSize: 12, color: "#78716C", marginLeft: 8 }}>#{j.numero}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, textAlign: "center" }}>
                  {[
                    { val: avg(stats, j.id, "points"), label: "pts" },
                    { val: avg(stats, j.id, "rebonds"), label: "reb" },
                    { val: avg(stats, j.id, "passes"), label: "pds" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{s.val}</div>
                      <div style={{ fontSize: 10, color: "#78716C", textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* STYLES RESPONSIFS */}
      <style jsx global>{`
        html, body {
          max-width: 100% !important;
          overflow-x: hidden !important;
        }
        @media (max-width: 768px) {
          .media-gallery-container {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 12px;
            gap: 12px !important;
          }
          .media-card {
            width: 270px !important;
            scroll-snap-align: start;
          }
          .media-gallery-container::-webkit-scrollbar {
            height: 4px;
          }
          .media-gallery-container::-webkit-scrollbar-thumb {
            background-color: rgba(249, 115, 22, 0.4);
            border-radius: 10px;
          }
        }
      `}</style>
    </div>
  );
}