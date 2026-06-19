"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// 🔐 Change ce mot de passe !
const ADMIN_PASSWORD = "kobeestlemeilleurbasketteur";

interface PendingJoueur {
  id: string;
  nom: string;
  prenom: string;
  surnom: string;
  numero: string;
  poste: "Meneur" | "Arrière" | "Ailier" | "Ailier Fort" | "Pivot";
  age: string;
  instagram: string;
  tiktok: string;
  dateInscription: string;
  statut: "en_attente" | "valide" | "refuse";
}

interface Joueur {
  id: string;
  nom: string;
  prenom: string;
  surnom?: string;
  numero: string;
  poste: PendingJoueur["poste"];
}

const POSTE_COLORS: Record<string, string> = {
  Meneur: "#A78BFA", Arrière: "#5EEAD4", Ailier: "#93C5FD",
  "Ailier Fort": "#FCA5A5", Pivot: "#FB923C",
};

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const [pending, setPending] = useState<PendingJoueur[]>([]);
  const [joueurs, setJoueurs] = useState<Joueur[]>([]);

  useEffect(() => {
    const auth = sessionStorage.getItem("courtiq_admin");
    if (auth === "true") setLoggedIn(true);
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    const p = localStorage.getItem("hoop_pending");
    const j = localStorage.getItem("hoop_joueurs");
    if (p) setPending(JSON.parse(p));
    if (j) setJoueurs(JSON.parse(j));
  }, [loggedIn]);

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("courtiq_admin", "true");
      setLoggedIn(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const accepter = (p: PendingJoueur) => {
    const nouveauJoueur: Joueur = {
      id: p.id,
      nom: p.nom,
      prenom: p.prenom,
      surnom: p.surnom,
      numero: p.numero,
      poste: p.poste,
    };
    const updatedJoueurs = [...joueurs, nouveauJoueur];
    setJoueurs(updatedJoueurs);
    localStorage.setItem("hoop_joueurs", JSON.stringify(updatedJoueurs));

    const updatedPending = pending.filter((x) => x.id !== p.id);
    setPending(updatedPending);
    localStorage.setItem("hoop_pending", JSON.stringify(updatedPending));
  };

  const refuser = (p: PendingJoueur) => {
    const updatedPending = pending.filter((x) => x.id !== p.id);
    setPending(updatedPending);
    localStorage.setItem("hoop_pending", JSON.stringify(updatedPending));
  };

  const inputStyle = {
    width: "100%",
    background: "#1C1917",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: "12px 14px",
    color: "#F5F5F4",
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
  };

  if (!loggedIn) {
    return (
      <div style={{
        background: "#1C1917", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif", padding: 24,
      }}>
        <div style={{
          background: "#2C2925",
          border: "1px solid rgba(249,115,22,0.2)",
          borderRadius: 16,
          padding: 40,
          maxWidth: 380,
          width: "100%",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 32,
            fontWeight: 900,
            color: "#F5F5F4",
            marginBottom: 8,
          }}>
            ESPACE <span style={{ color: "#F97316" }}>ADMIN</span>
          </h1>
          <p style={{ color: "#78716C", fontSize: 14, marginBottom: 24 }}>
            Accès réservé à l'administrateur de ApexUT.
          </p>

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            style={inputStyle}
          />

          {error && (
            <p style={{ color: "#FCA5A5", fontSize: 13, marginTop: 10 }}>
              ❌ Mot de passe incorrect.
            </p>
          )}

          <button
            onClick={login}
            style={{
              width: "100%",
              background: "#F97316",
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: 14,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: 1,
              cursor: "pointer",
              marginTop: 16,
            }}
          >
            SE CONNECTER
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#1C1917", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", padding: "40px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 48,
              fontWeight: 900,
              color: "#F5F5F4",
              lineHeight: 1,
            }}>
              ESPACE <span style={{ color: "#F97316" }}>ADMIN</span>
            </h1>
            <p style={{ color: "#78716C", marginTop: 8, fontSize: 15 }}>
              Gère les demandes d'inscription et accède à la saisie des stats.
            </p>
          </div>

          <Link href="/admin/stats" style={{
            background: "#F97316",
            color: "white",
            padding: "14px 28px",
            borderRadius: 10,
            textDecoration: "none",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 16,
            fontWeight: 900,
            letterSpacing: 1,
          }}>
            📋 SAISIR DES STATS
          </Link>
        </div>

        <div style={{ marginBottom: 16 }}>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 4,
          }}>
            Demandes en attente
          </h2>
          <p style={{ fontSize: 13, color: "#78716C" }}>
            {pending.length} demande{pending.length !== 1 ? "s" : ""} à traiter
          </p>
        </div>

        {pending.length === 0 ? (
          <div style={{
            background: "#2C2925",
            border: "1px dashed rgba(255,255,255,0.1)",
            borderRadius: 16,
            padding: 48,
            textAlign: "center",
            color: "#78716C",
          }}>
            <p style={{ fontSize: 36, marginBottom: 12 }}>📭</p>
            <p>Aucune nouvelle demande d'inscription.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pending.map((p) => (
              <div key={p.id} style={{
                background: "#2C2925",
                border: "1px solid rgba(249,115,22,0.2)",
                borderRadius: 12,
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}>
                <div style={{
                  width: 46, height: 46, borderRadius: "50%",
                  background: "#FED7AA", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700, fontSize: 16, color: "#C2410C", flexShrink: 0,
                }}>
                  {p.prenom[0]}{p.nom[0]}
                </div>

                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>
                    {p.prenom} {p.nom}
                    {p.surnom && (
                      <span style={{ color: "#F97316", fontWeight: 500 }}> "{p.surnom}"</span>
                    )}
                  </div>
                  <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                      background: `${POSTE_COLORS[p.poste]}22`, color: POSTE_COLORS[p.poste],
                      textTransform: "uppercase", letterSpacing: 0.5,
                    }}>{p.poste}</span>
                    <span style={{ fontSize: 12, color: "#78716C" }}>#{p.numero}</span>
                    {p.age && <span style={{ fontSize: 12, color: "#78716C" }}>· {p.age} ans</span>}
                  </div>
                  {(p.instagram || p.tiktok) && (
                    <div style={{ marginTop: 6, display: "flex", gap: 12, fontSize: 12, color: "#78716C" }}>
                      {p.instagram && <span>📸 {p.instagram}</span>}
                      {p.tiktok && <span>🎵 {p.tiktok}</span>}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: "#44403C", marginTop: 4 }}>
                    Inscrit le {p.dateInscription}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => accepter(p)} style={{
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.3)",
                    color: "#86EFAC",
                    borderRadius: 8,
                    padding: "8px 16px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}>
                    ✅ Accepter
                  </button>
                  <button onClick={() => refuser(p)} style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "#FCA5A5",
                    borderRadius: 8,
                    padding: "8px 16px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}>
                    ❌ Refuser
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 48 }}>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 16,
          }}>
            Effectif validé ({joueurs.length})
          </h2>
          {joueurs.length === 0 ? (
            <p style={{ color: "#78716C", fontSize: 14 }}>Aucun joueur dans l'effectif pour le moment.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
              {joueurs.map((j) => (
                <div key={j.id} style={{
                  background: "#2C2925",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                    background: `${POSTE_COLORS[j.poste]}22`, color: POSTE_COLORS[j.poste],
                  }}>{j.poste.slice(0, 2).toUpperCase()}</span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>
                    {j.prenom} {j.nom}
                    {j.surnom && <span style={{ color: "#F97316" }}> "{j.surnom}"</span>}
                  </span>
                  <span style={{ fontSize: 12, color: "#78716C", marginLeft: "auto" }}>#{j.numero}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
