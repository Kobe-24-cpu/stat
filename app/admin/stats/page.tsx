"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 🔐 Doit être identique au mot de passe dans app/admin/page.tsx
const ADMIN_PASSWORD = "kobeestlemeilleurbasketteur";

interface Joueur {
  id: string;
  nom: string;
  prenom: string;
  numero: string;
  poste: string;
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
  adversaire: string;
  resultat: string;
}

const STATS_DEF = [
  { key: "points", label: "Points" },
  { key: "passes", label: "Passes" },
  { key: "rebonds", label: "Rebonds" },
  { key: "contres", label: "Contres" },
  { key: "interceptions", label: "Interceptions" },
  { key: "turnovers", label: "Balles perdues" },
];

const defaultStats = () =>
  Object.fromEntries(STATS_DEF.map((s) => [s.key, 0]));

export default function AdminStatsPage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const [joueurs, setJoueurs] = useState<Joueur[]>([]);
  const [allStats, setAllStats] = useState<MatchStat[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [adversaire, setAdversaire] = useState("");
  const [resultat, setResultat] = useState("Victoire");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [stats, setStats] = useState<Record<string, number>>(defaultStats());
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("courtiq_admin");
    if (auth === "true") setLoggedIn(true);
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    const j = localStorage.getItem("hoop_joueurs");
    const s = localStorage.getItem("hoop_stats");
    if (j) setJoueurs(JSON.parse(j));
    if (s) setAllStats(JSON.parse(s));
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

  const change = (key: string, delta: number) => {
    setStats((prev) => ({ ...prev, [key]: Math.max(0, prev[key] + delta) }));
  };

  const enregistrer = () => {
    if (!selectedId || !adversaire.trim()) return;
    const newStat: MatchStat = {
      id: Date.now().toString(),
      joueurId: selectedId,
      date,
      adversaire,
      resultat,
      ...stats,
    } as MatchStat;

    const updated = [...allStats, newStat];
    setAllStats(updated);
    localStorage.setItem("hoop_stats", JSON.stringify(updated));
    setStats(defaultStats());
    setAdversaire("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
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

  const labelStyle = {
    display: "block" as const,
    fontSize: 11,
    color: "#A8A29E",
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    fontWeight: 600,
    marginBottom: 6,
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
            ACCÈS <span style={{ color: "#F97316" }}>STATS</span>
          </h1>
          <p style={{ color: "#78716C", fontSize: 14, marginBottom: 24 }}>
            Mot de passe administrateur requis.
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
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 52,
              fontWeight: 900,
              color: "#F5F5F4",
              lineHeight: 1,
            }}>
              SAISIE DES <span style={{ color: "#F97316" }}>STATS</span>
            </h1>
            <p style={{ color: "#78716C", marginTop: 8, fontSize: 15 }}>
              Entre les performances d'un joueur après chaque match.
            </p>
          </div>
          <button onClick={() => router.push("/admin")} style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#A8A29E",
            borderRadius: 8,
            padding: "10px 18px",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            ← Retour admin
          </button>
        </div>

        <div style={{
          background: "#2C2925",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: 28,
        }}>
          {joueurs.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#78716C" }}>
              <p style={{ fontSize: 36, marginBottom: 12 }}>👤</p>
              <p>Aucun joueur dans l'effectif. Valide d'abord des demandes depuis <strong style={{ color: "#F97316" }}>/admin</strong>.</p>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Joueur</label>
                  <select style={inputStyle} value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                    <option value="">-- Choisir un joueur --</option>
                    {joueurs.map((j) => (
                      <option key={j.id} value={j.id}>{j.prenom} {j.nom} — {j.poste} #{j.numero}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Date du match</label>
                  <input style={inputStyle} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Résultat</label>
                  <select style={inputStyle} value={resultat} onChange={(e) => setResultat(e.target.value)}>
                    <option>Victoire</option>
                    <option>Défaite</option>
                  </select>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Adversaire</label>
                  <input style={inputStyle} placeholder="Nom de l'équipe adverse" value={adversaire} onChange={(e) => setAdversaire(e.target.value)} />
                </div>
              </div>

              <div style={{ fontSize: 11, color: "#A8A29E", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 14 }}>
                Statistiques du match
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
                {STATS_DEF.map((s) => (
                  <div key={s.key} style={{
                    background: "#1C1917",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10,
                    padding: "14px 12px",
                    textAlign: "center",
                  }}>
                    <div style={{ fontSize: 11, color: "#A8A29E", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                      {s.label}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                      <button onClick={() => change(s.key, -1)} style={{
                        width: 30, height: 30, borderRadius: 6,
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "#2C2925", color: "#F5F5F4",
                        fontSize: 18, cursor: "pointer", fontWeight: 600,
                      }}>−</button>
                      <span style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: 28, fontWeight: 700,
                        minWidth: 38, textAlign: "center",
                      }}>
                        {stats[s.key]}
                      </span>
                      <button onClick={() => change(s.key, 1)} style={{
                        width: 30, height: 30, borderRadius: 6,
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "#2C2925", color: "#F5F5F4",
                        fontSize: 18, cursor: "pointer", fontWeight: 600,
                      }}>+</button>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={enregistrer} style={{
                width: "100%",
                background: "#F97316",
                color: "white",
                border: "none",
                borderRadius: 10,
                padding: 16,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 20,
                fontWeight: 900,
                letterSpacing: 1,
                cursor: "pointer",
              }}>
                ENREGISTRER LES STATS →
              </button>

              {success && (
                <div style={{
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  color: "#86EFAC",
                  borderRadius: 8,
                  padding: "12px 16px",
                  fontSize: 14,
                  textAlign: "center",
                  marginTop: 16,
                }}>
                  ✅ Stats enregistrées avec succès !
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
