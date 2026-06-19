"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/",        label: "Accueil" },
  { href: "/joueurs", label: "Rejoindre l'équipe" },
  { href: "/top5",    label: "Top 5 UT" },
];

export default function Header() {
  const pathname = usePathname();

  return (
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
        padding: "0 24px",
        height: 68,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}>

        <Link href="/" style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 28,
          fontWeight: 900,
          color: "#F97316",
          letterSpacing: 3,
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}>
          <span style={{
            width: 10, height: 10,
            borderRadius: "50%",
            background: "#F97316",
            display: "inline-block",
            boxShadow: "0 0 10px #F97316",
          }} />
          ApexUT
        </Link>

        <nav style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "8px 18px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#ffffff" : "#A8A29E",
                  textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif",
                  background: isActive ? "#F97316" : "transparent",
                  letterSpacing: isActive ? 0.5 : 0,
                  whiteSpace: "nowrap",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/admin"
          style={{
            fontSize: 11,
            padding: "8px 16px",
            borderRadius: 20,
            border: "1px solid #F97316",
            color: "#F97316",
            fontWeight: 700,
            letterSpacing: 1.5,
            fontFamily: "'DM Sans', sans-serif",
            textTransform: "uppercase",
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
            cursor: "pointer",
            position: "relative",
            zIndex: 1001,
          }}
        >
          Admin
        </Link>

      </div>
    </header>
  );
}
