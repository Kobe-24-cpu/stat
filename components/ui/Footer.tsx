import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      background: "#111",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "56px 24px 32px",
      marginTop: 80,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
      }}>

        {/* ── Grille principale ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 48,
          marginBottom: 48,
        }}>

          {/* Brand */}
          <div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 32,
              fontWeight: 900,
              color: "#F97316",
              letterSpacing: 3,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              <span style={{
                width: 10, height: 10,
                borderRadius: "50%",
                background: "#F97316",
                boxShadow: "0 0 8px #F97316",
              }} />
              ApexUT
            </div>
            <p style={{
              fontSize: 14,
              color: "#78716C",
              lineHeight: 1.8,
              maxWidth: 280,
            }}>
              Plateforme de suivi des performances basketball avec stats détaillées pour chaque joueur .
              Classement du Top 5 par poste.
            </p>
            {/* Réseaux sociaux — à remplir */}
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              {["Instagram", "Twitter", "TikTok"].map((r) => (
                <span key={r} style={{
                  fontSize: 11,
                  padding: "5px 12px",
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#78716C",
                  cursor: "pointer",
                }}>{r}</span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#F97316",
              marginBottom: 20,
            }}>Navigation</div>
            {[
              { href: "/",        label: "Accueil" },
              { href: "/joueurs", label: "Joueurs" },
              { href: "/top5",   label: "Top 5 UT" },
              { href: "/admin",    label: "Admin" },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{
                display: "block",
                fontSize: 14,
                color: "#78716C",
                textDecoration: "none",
                marginBottom: 10,
                transition: "color 0.15s",
              }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Université */}
          <div>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#F97316",
              marginBottom: 20,
            }}>Université</div>
            <p style={{ fontSize: 14, color: "#78716C", lineHeight: 1.9 }}>
              {/* 👉 Remplace par le vrai nom */}
              UIDT<br />
              UFR SET, SES, SS, SI<br />
              Thiès, Sénégal<br />
              Année 2025–2026
            </p>
          </div>

          {/* Contact */}
          <div>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#F97316",
              marginBottom: 20,
            }}>Contact</div>
            <p style={{ fontSize: 14, color: "#78716C", lineHeight: 1.9 }}>
              {/* 👉 Remplace par tes vraies infos */}
              Moussa B. Sané<br />
              https://www.instagram.com<br />
              bouchkarbryant@gmail.com<br />
              +221 76 742 45 58
            </p>
          </div>
        </div>

        {/* ── Barre du bas ── */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          paddingTop: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <span style={{ fontSize: 13, color: "#44403C" }}>
            © 2026 ApexUT — Tous droits réservés
          </span>
          <span style={{ fontSize: 13, color: "#44403C" }}>
            Projet universitaire — Ultimate Team
          </span>
        </div>

      </div>
    </footer>
  );
}
