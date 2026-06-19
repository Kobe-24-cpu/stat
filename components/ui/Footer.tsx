"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#0C0A09", borderTop: "1px solid #2C2925", color: "#F5F5F4", width: "100%", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 40px" }}>
        
        {/* Grille principale : Gérée par la classe CSS en bas pour basculer sur mobile */}
        <div className="footer-grid" style={{ display: "flex", gap: 40, justifyContent: "space-between", flexWrap: "wrap" }}>
          
          {/* Colonne Description de la marque */}
          <div style={{ flex: "1 1 280px", minWidth: 250 }}>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 900, color: "#F97316", margin: "0 0 16px 0", letterSpacing: 0.5 }}>
              • ApexUT
            </h3>
            <p style={{ fontSize: 14, color: "#A8A29E", lineHeight: 1.6, margin: "0 0 24px 0" }}>
              Plateforme de suivi des performances basketball avec stats détaillées pour chaque joueur. Classement du Top 5 par poste.
            </p>
            {/* Réseaux sociaux */}
            <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#78716C" }}>
              <a href="#" style={{ color: "#78716C", textDecoration: "none" }} onMouseEnter={(e) => e.currentTarget.style.color = "#F97316"} onMouseLeave={(e) => e.currentTarget.style.color = "#78716C"}>Instagram</a>
              <a href="#" style={{ color: "#78716C", textDecoration: "none" }} onMouseEnter={(e) => e.currentTarget.style.color = "#F97316"} onMouseLeave={(e) => e.currentTarget.style.color = "#78716C"}>Twitter</a>
              <a href="#" style={{ color: "#78716C", textDecoration: "none" }} onMouseEnter={(e) => e.currentTarget.style.color = "#F97316"} onMouseLeave={(e) => e.currentTarget.style.color = "#78716C"}>TikTok</a>
            </div>
          </div>

          {/* Liens de Navigation */}
          <div style={{ flex: "1 1 150px", minWidth: 140 }}>
            <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 800, color: "#F97316", margin: "0 0 16px 0", letterSpacing: 1, textTransform: "uppercase" }}>
              Navigation
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
              <li><Link href="/" style={{ color: "#A8A29E", textDecoration: "none" }}>Accueil</Link></li>
              <li><Link href="/joueurs" style={{ color: "#A8A29E", textDecoration: "none" }}>Joueurs</Link></li>
              <li><Link href="/top5" style={{ color: "#A8A29E", textDecoration: "none" }}>Top 5 UT</Link></li>
              <li><Link href="/admin" style={{ color: "#A8A29E", textDecoration: "none" }}>Admin</Link></li>
            </ul>
          </div>

          {/* Infos Université */}
          <div style={{ flex: "1 1 180px", minWidth: 160 }}>
            <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 800, color: "#F97316", margin: "0 0 16px 0", letterSpacing: 1, textTransform: "uppercase" }}>
              Université
            </h4>
            <div style={{ fontSize: 14, color: "#A8A29E", display: "flex", flexDirection: "column", gap: 8, lineHeight: 1.4 }}>
              <span>UIDT</span>
              <span>UFR SET, SES, SS, SI</span>
              <span>Thiès, Sénégal</span>
              <span style={{ color: "#78716C", fontSize: 13, marginTop: 4 }}>Année 2025–2026</span>
            </div>
          </div>

          {/* Infos Contact */}
          <div style={{ flex: "1 1 200px", minWidth: 180 }}>
            <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 800, color: "#F97316", margin: "0 0 16px 0", letterSpacing: 1, textTransform: "uppercase" }}>
              Contact
            </h4>
            <div style={{ fontSize: 14, color: "#A8A29E", display: "flex", flexDirection: "column", gap: 8, lineHeight: 1.4 }}>
              <span style={{ fontWeight: 600, color: "#F5F5F4" }}>Moussa B. Sané</span>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "#A8A29E", textDecoration: "none" }}>https://www.instagram.com</a>
              <a href="mailto:bouchkarbryant@gmail.com" style={{ color: "#A8A29E", textDecoration: "none" }}>bouchkarbryant@gmail.com</a>
              <a href="tel:+221767424558" style={{ color: "#A8A29E", textDecoration: "none" }}>+221 76 742 45 58</a>
            </div>
          </div>

        </div>

        {/* Ligne de Copyright tout en bas */}
        <div style={{ marginTop: 50, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, fontSize: 13, color: "#78716C" }}>
          <div>© 2026 ApexUT — Tous droits réservés.</div>
          <div style={{ fontWeight: 500 }}>Projet universitaire — Ultimate Team</div>
        </div>

      </div>

      {/* Règle CSS pour forcer le rangement propre sur téléphone */}
      <style jsx>{`
        @media (max-width: 768px) {
          .footer-grid {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </footer>
  );
}