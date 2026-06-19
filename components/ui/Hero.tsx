"use client";

import React from "react";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "80vh", // Hauteur immersive pour le Hero
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#1C1917", // Couleur de secours
        
        // Configuration de l'image d'arrière-plan locale
        backgroundImage: "url('/images/photo8.jpeg')", // Utilise une de tes photos du dossier public/images
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* OVERLAY SOMBRE (Pour garantir le contraste et la lisibilité du texte par-dessus la photo) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(28, 25, 23, 0.75)", // Assombrit la photo à 75%
          zIndex: 1,
        }}
      />

      {/* CONTENU TEXTE ET BOUTONS */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          maxWidth: 800,
          padding: "0 20px",
        }}
      >
        <span
          style={{
            color: "#F97316",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 15,
            display: "inline-block",
          }}
        >
          Domine ton jeu • Analyse tes stats
        </span>

        <h1
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(42px, 6vw, 72px)", // S'adapte à la taille de l'écran
            fontWeight: 900,
            color: "#F5F5F4",
            lineHeight: 1,
            margin: "0 0 20px 0",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          PROPULSE TON BASKETBALL DANS <span style={{ color: "#F97316" }}>UNE AUTRE DIMENSION</span>
        </h1>

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: "#A8A29E", // Gris plus clair pour ressortir sur l'overlay
            fontSize: "clamp(15px, 2vw, 19px)",
            lineHeight: 1.6,
            maxWidth: 650,
            margin: "0 auto 40px auto",
          }}
        >
          Suis tes performances à chaque match, compare tes progressions avec les meilleurs joueurs de la ligue et obtiens les conseils tactiques personnalisés de notre Coach IA.
        </p>

        {/* BOUTONS D'ACTION */}
        <div
          style={{
            display: "flex",
            gap: 20,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/top5"
            style={{
              background: "#F97316",
              color: "white",
              padding: "16px 32px",
              borderRadius: 10,
              textDecoration: "none",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: 1,
              transition: "transform 0.2s, background-color 0.2s",
              boxShadow: "0 10px 20px rgba(249, 115, 22, 0.2)",
            }}
          >
            🏆 VOIR LE TOP 5 IA
          </Link>

          <Link
            href="/joueurs"
            style={{
              background: "transparent",
              color: "#F5F5F4",
              padding: "16px 32px",
              borderRadius: 10,
              textDecoration: "none",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: 1,
              border: "2px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            🏀 REJOINDRE LA LIGUE
          </Link>
        </div>
      </div>
    </section>
  );
}