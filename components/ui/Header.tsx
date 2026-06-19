"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/",        label: "Accueil",           icon: "🏠" },
  { href: "/joueurs", label: "Rejoindre l'équipe", icon: "🏀" },
  { href: "/top5",    label: "Top 5 IA",           icon: "🏆" },
  { href: "/admin",   label: "Admin",              icon: "🔐" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOuvert, setMenuOuvert] = useState(false);

  return (
    <>
      <header style={{
        background: "#111111",
        borderBottom: "1px solid rgba(249,115,22,0.2)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 20px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>

          {/* Logo */}
          <Link href="/" style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 26,
            fontWeight: 900,
            color: "#F97316",
            letterSpacing: 3,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}>
            <span style={{
              width: 9, height: 9,
              borderRadius: "50%",
              background: "#F97316",
              boxShadow: "0 0 8px #F97316",
              display: "inline-block",
            }} />
            COURTIQ
          </Link>

          {/* Nav desktop — cachée sur mobile via CSS */}
          <nav className="desktop-nav" style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const isAdmin = link.href === "/admin";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: isAdmin ? "7px 16px" : "8px 16px",
                    borderRadius: isAdmin ? 20 : 8,
                    fontSize: 14,
                    fontWeight: isActive ? 700 : 500,
                    color: isAdmin ? "#F97316" : isActive ? "#fff" : "#A8A29E",
                    textDecoration: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    background: isActive && !isAdmin ? "#F97316" : "transparent",
                    border: isAdmin ? "1px solid #F97316" : "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Bouton hamburger — visible uniquement sur mobile via CSS */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOuvert(!menuOuvert)}
            aria-label="Menu"
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              width: 42,
              height: 42,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: 0,
            }}
          >
            <span style={{
              display: "block", width: 20, height: 2,
              background: menuOuvert ? "#F97316" : "#F5F5F4",
              borderRadius: 2,
              transform: menuOuvert ? "rotate(45deg) translateY(7px)" : "none",
              transition: "all 0.2s ease",
            }} />
            <span style={{
              display: "block", width: 20, height: 2,
              background: "#F5F5F4", borderRadius: 2,
              opacity: menuOuvert ? 0 : 1,
              transition: "opacity 0.2s ease",
            }} />
            <span style={{
              display: "block", width: 20, height: 2,
              background: menuOuvert ? "#F97316" : "#F5F5F4",
              borderRadius: 2,
              transform: menuOuvert ? "rotate(-45deg) translateY(-7px)" : "none",
              transition: "all 0.2s ease",
            }} />
          </button>

        </div>

        {/* Menu mobile déroulant */}
        {menuOuvert && (
          <div className="mobile-menu" style={{
            background: "#111111",
            borderTop: "1px solid rgba(249,115,22,0.12)",
            padding: "10px 16px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}>
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const isAdmin = link.href === "/admin";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOuvert(false)}
                  style={{
                    padding: "14px 18px",
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: isActive ? 700 : 500,
                    color: isAdmin ? "#F97316" : isActive ? "#fff" : "#A8A29E",
                    textDecoration: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    background: isAdmin
                      ? "rgba(249,115,22,0.08)"
                      : isActive
                      ? "#F97316"
                      : "rgba(255,255,255,0.03)",
                    border: isAdmin
                      ? "1px solid rgba(249,115,22,0.25)"
                      : isActive
                      ? "1px solid transparent"
                      : "1px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 20, lineHeight: 1 }}>{link.icon}</span>
                  <span style={{ flex: 1 }}>{link.label}</span>
                  {isActive && !isAdmin && (
                    <span style={{ fontSize: 10, color: isActive ? "rgba(255,255,255,0.6)" : "#F97316" }}>●</span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 768px) {
          .hamburger-btn { display: none !important; }
          .mobile-menu   { display: none !important; }
          .desktop-nav   { display: flex !important; }
        }
        @media (max-width: 767px) {
          .hamburger-btn { display: flex !important; }
          .desktop-nav   { display: none !important; }
        }
      `}} />
    </>
  );
}
