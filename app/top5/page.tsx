"use client";
import { useState, useEffect, useRef } from "react";
import {
  Joueur,
  MatchStat,
  TopJoueur,
  POSTE_COLORS,
  calculerTop5,
  moyenneStat,
  moyennesDuTop5,
  analyseLocalePourPoste,
  scoreEvaluationBrute,
} from "@/lib/scoring";

type Tab = "top5" | "profil" | "chat";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ─────────────────────────────────────────────────────────────────────────
// Styles partagés (objets JS — cohérents avec le reste de l'app ApexUT)
// ─────────────────────────────────────────────────────────────────────────
const colors = {
  bg: "#1C1917",
  card: "#2C2925",
  border: "rgba(255,255,255,0.06)",
  accent: "#F97316",
  text: "#F5F5F4",
  textMuted: "#78716C",
};

const fontTitle = "'Barlow Condensed', sans-serif";
const fontBody = "'DM Sans', sans-serif";

export default function Top5Page() {
  const [activeTab, setActiveTab] = useState<Tab>("top5");
  const [joueurs, setJoueurs] = useState<Joueur[]>([]);
  const [stats, setStats] = useState<MatchStat[]>([]);
  const [profilActifId, setProfilActifId] = useState<string>("");

  useEffect(() => {
    const j = localStorage.getItem("hoop_joueurs");
    const s = localStorage.getItem("hoop_stats");
    if (j) setJoueurs(JSON.parse(j));
    if (s) setStats(JSON.parse(s));

    const dernierProfil = localStorage.getItem("apexut_profil_actif");
    if (dernierProfil) setProfilActifId(dernierProfil);
  }, []);

  const top5 = calculerTop5(joueurs, stats);
  const moyennesTop5 = moyennesDuTop5(top5, stats);

  const profilActif = joueurs.find((j) => j.id === profilActifId) || null;

  const top5Resume = top5
    .filter((t) => t.joueur)
    .map((t) => ({ poste: t.poste, nom: `${t.joueur!.prenom} ${t.joueur!.nom}`, score: t.score }));

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", fontFamily: fontBody, color: colors.text }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* ── En-tête ── */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: fontTitle,
            fontSize: 52,
            fontWeight: 900,
            lineHeight: 1,
            color: colors.text,
          }}>
            TOP 5  <span style={{ color: colors.accent }}>— UT</span>
          </h1>
          <p style={{ color: colors.textMuted, marginTop: 8, fontSize: 15 }}>
            Analyse tactique générée par le Coach IA, basée sur les performances réelles de chaque joueur.
          </p>
        </div>

        {/* ── Onglets ── */}
        <div style={{ display: "flex", gap: 6, marginBottom: 32, borderBottom: `1px solid ${colors.border}`, paddingBottom: 0 }}>
          {[
            { id: "top5" as Tab, label: "🏆 Top 5" },
            { id: "profil" as Tab, label: "📊 Mon Profil" },
            { id: "chat" as Tab, label: "💬 Coach IA" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "12px 20px",
                background: "transparent",
                border: "none",
                borderBottom: activeTab === tab.id ? `2px solid ${colors.accent}` : "2px solid transparent",
                color: activeTab === tab.id ? colors.text : colors.textMuted,
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: fontBody,
                marginBottom: -1,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "top5" && <Top5View top5={top5} stats={stats} />}
        {activeTab === "profil" && (
          <ProfilView
            joueurs={joueurs}
            stats={stats}
            profilActif={profilActif}
            top5={top5}
            moyennesTop5={moyennesTop5}
            onSelectProfil={(id) => {
              setProfilActifId(id);
              localStorage.setItem("apexut_profil_actif", id);
            }}
          />
        )}
        {activeTab === "chat" && (
          <ChatCoach profilActif={profilActif} stats={stats} top5Resume={top5Resume} joueurs={joueurs} onSelectProfil={(id) => {
            setProfilActifId(id);
            localStorage.setItem("apexut_profil_actif", id);
          }} />
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// VUE 1 — TOP 5 (podium + cartes détaillées)
// ═════════════════════════════════════════════════════════════════════════
function Top5View({ top5, stats }: { top5: TopJoueur[]; stats: MatchStat[] }) {
  const auMoinsUnJoueur = top5.some((t) => t.joueur);

  if (!auMoinsUnJoueur) {
    return (
      <div style={{
        background: colors.card,
        border: `1px dashed ${colors.border}`,
        borderRadius: 16,
        padding: 60,
        textAlign: "center",
      }}>
        <p style={{ fontSize: 40, marginBottom: 16 }}>🏀</p>
        <p style={{ color: colors.textMuted, fontSize: 16 }}>
          Aucune statistique enregistrée pour le moment. Le Top 5 apparaîtra dès que des matchs auront été saisis.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ── Podium ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 32 }}>
        {top5.map(({ poste, joueur, score }) => (
          <div key={poste} style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 14,
            padding: "22px 14px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 3,
              background: POSTE_COLORS[poste],
            }} />
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: colors.textMuted, marginBottom: 14 }}>
              {poste}
            </div>
            <div style={{
              width: 58, height: 58, borderRadius: "50%",
              background: joueur ? "#FED7AA" : "#292524",
              margin: "0 auto 12px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: fontTitle, fontSize: 20, fontWeight: 700, color: "#C2410C",
            }}>
              {joueur ? `${joueur.prenom[0]}${joueur.nom[0]}` : "?"}
            </div>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
              {joueur ? `${joueur.prenom} ${joueur.nom[0]}.` : "Aucune donnée"}
              {joueur?.surnom && <div style={{ color: colors.accent, fontSize: 11, marginTop: 2 }}>"{joueur.surnom}"</div>}
            </div>
            <div style={{ fontFamily: fontTitle, fontSize: 34, fontWeight: 900, color: joueur ? colors.accent : "#44403C" }}>
              {joueur ? score : "—"}
              {joueur && <small style={{ fontSize: 13, color: colors.textMuted, fontFamily: fontBody, fontWeight: 400 }}>/100</small>}
            </div>
          </div>
        ))}
      </div>

      {/* ── Cartes d'analyse détaillée ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {top5.map(({ poste, joueur, score, scoreBrut }) => {
          if (!joueur) {
            return (
              <div key={poste} style={{
                background: colors.card,
                border: `1px solid ${colors.border}`,
                borderRadius: 14,
                padding: 20,
                color: "#44403C",
              }}>
                <strong>{poste}</strong> — Aucun joueur avec des statistiques à ce poste.
              </div>
            );
          }

          return (
            <div key={poste} style={{
              background: colors.card,
              border: `1px solid ${POSTE_COLORS[poste]}33`,
              borderRadius: 14,
              padding: 24,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%", background: "#FED7AA",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: fontTitle, fontWeight: 700, fontSize: 14, color: "#C2410C",
                  }}>
                    {joueur.prenom[0]}{joueur.nom[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>
                      {joueur.prenom} {joueur.nom}
                      {joueur.surnom && <span style={{ color: colors.accent }}> "{joueur.surnom}"</span>}
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                      background: `${POSTE_COLORS[poste]}22`, color: POSTE_COLORS[poste],
                      textTransform: "uppercase", letterSpacing: 0.5,
                    }}>{poste} · #{joueur.numero}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: fontTitle, fontSize: 26, fontWeight: 900, color: colors.accent }}>
                    {score}<small style={{ fontSize: 12, color: colors.textMuted, fontFamily: fontBody }}>/100 pondéré</small>
                  </div>
                  <div style={{ fontSize: 11, color: colors.textMuted }}>Évaluation brute : {scoreBrut}</div>
                </div>
              </div>

              <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.7, marginBottom: 12 }}>
                🏀 {analyseLocalePourPoste(joueur, stats)}
              </p>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", paddingTop: 12, borderTop: `1px solid ${colors.border}` }}>
                {[
                  { label: "Points", val: moyenneStat(stats, joueur.id, "points") },
                  { label: "Rebonds", val: moyenneStat(stats, joueur.id, "rebonds") },
                  { label: "Passes", val: moyenneStat(stats, joueur.id, "passes") },
                  { label: "Interceptions", val: moyenneStat(stats, joueur.id, "interceptions") },
                  { label: "Contres", val: moyenneStat(stats, joueur.id, "contres") },
                  { label: "Pertes", val: moyenneStat(stats, joueur.id, "turnovers") },
                ].map((s) => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: fontTitle, fontSize: 20, fontWeight: 700 }}>{s.val}</div>
                    <div style={{ fontSize: 10, color: colors.textMuted, textTransform: "uppercase" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// VUE 2 — MON PROFIL (sélection joueur + comparaison avec le Top 5)
// ═════════════════════════════════════════════════════════════════════════
function ProfilView({
  joueurs, stats, profilActif, top5, moyennesTop5, onSelectProfil,
}: {
  joueurs: Joueur[];
  stats: MatchStat[];
  profilActif: Joueur | null;
  top5: TopJoueur[];
  moyennesTop5: Record<string, number>;
  onSelectProfil: (id: string) => void;
}) {
  if (!joueurs.length) {
    return (
      <div style={{ background: colors.card, border: `1px dashed ${colors.border}`, borderRadius: 16, padding: 48, textAlign: "center", color: colors.textMuted }}>
        Aucun joueur dans l'effectif pour le moment.
      </div>
    );
  }

  const selectStyle = {
    width: "100%",
    maxWidth: 360,
    background: colors.bg,
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    padding: "10px 14px",
    color: colors.text,
    fontSize: 14,
    fontFamily: fontBody,
    outline: "none",
    marginBottom: 24,
  };

  if (!profilActif) {
    return (
      <div>
        <p style={{ color: colors.textMuted, marginBottom: 12, fontSize: 14 }}>
          Sélectionne ton profil pour voir ton analyse personnalisée.
        </p>
        <select style={selectStyle} onChange={(e) => onSelectProfil(e.target.value)} defaultValue="">
          <option value="" disabled>-- Choisir un joueur --</option>
          {joueurs.map((j) => (
            <option key={j.id} value={j.id}>{j.prenom} {j.nom} — {j.poste}</option>
          ))}
        </select>
      </div>
    );
  }

  const statsJoueur = stats.filter((s) => s.joueurId === profilActif.id);
  const estDansLeTop5 = top5.some((t) => t.joueur?.id === profilActif.id);
  const placeAuPoste = top5.find((t) => t.poste === profilActif.poste);

  const mesStats = {
    points: moyenneStat(stats, profilActif.id, "points"),
    rebonds: moyenneStat(stats, profilActif.id, "rebonds"),
    passes: moyenneStat(stats, profilActif.id, "passes"),
    interceptions: moyenneStat(stats, profilActif.id, "interceptions"),
    contres: moyenneStat(stats, profilActif.id, "contres"),
    turnovers: moyenneStat(stats, profilActif.id, "turnovers"),
  };

 const comparaisons: { key: keyof typeof mesStats; label: string; inverse?: boolean }[] = [
    { key: "points", label: "Points" },
    { key: "rebonds", label: "Rebonds" },
    { key: "passes", label: "Passes" },
    { key: "interceptions", label: "Interceptions" },
    { key: "contres", label: "Contres" },
    { key: "turnovers", label: "Pertes de balle", inverse: true },
  ];
  return (
    <div>
      <select style={selectStyle} value={profilActif.id} onChange={(e) => onSelectProfil(e.target.value)}>
        {joueurs.map((j) => (
          <option key={j.id} value={j.id}>{j.prenom} {j.nom} — {j.poste}</option>
        ))}
      </select>

      {/* ── Carte profil ── */}
      <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", background: "#FED7AA",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: fontTitle, fontWeight: 700, fontSize: 20, color: "#C2410C",
          }}>
            {profilActif.prenom[0]}{profilActif.nom[0]}
          </div>
          <div>
            <div style={{ fontFamily: fontTitle, fontSize: 24, fontWeight: 900 }}>
              {profilActif.prenom} {profilActif.nom}
              {profilActif.surnom && <span style={{ color: colors.accent }}> "{profilActif.surnom}"</span>}
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 4,
              background: `${POSTE_COLORS[profilActif.poste]}22`, color: POSTE_COLORS[profilActif.poste],
              textTransform: "uppercase",
            }}>{profilActif.poste} · #{profilActif.numero}</span>
          </div>

          <div style={{ marginLeft: "auto" }}>
            {estDansLeTop5 ? (
              <span style={{
                background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
                color: "#86EFAC", borderRadius: 20, padding: "8px 16px", fontSize: 13, fontWeight: 700,
              }}>
                🏆 Dans le Top 5
              </span>
            ) : (
              <span style={{
                background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)",
                color: colors.accent, borderRadius: 20, padding: "8px 16px", fontSize: 13, fontWeight: 700,
              }}>
                Hors Top 5
              </span>
            )}
          </div>
        </div>

        {statsJoueur.length === 0 ? (
          <p style={{ color: colors.textMuted, fontSize: 14 }}>
            Aucune statistique enregistrée encore. Demande à ton coach de saisir tes performances après le prochain match !
          </p>
        ) : (
          <>
            <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 16 }}>
              Comparaison de tes moyennes avec celles du {estDansLeTop5 ? "reste" : ""} Top 5 du mois :
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {comparaisons.map(({ key, label, inverse }) => {
                const mine = mesStats[key];
                const ref = moyennesTop5[key] || 0;
                const meilleur = inverse ? mine <= ref : mine >= ref;

                return (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 110, fontSize: 12, color: colors.textMuted }}>{label}</div>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        fontFamily: fontTitle, fontSize: 18, fontWeight: 700, width: 44, textAlign: "right",
                        color: meilleur ? "#86EFAC" : colors.text,
                      }}>{mine}</div>
                      <div style={{ flex: 1, height: 6, background: "#1C1917", borderRadius: 4, position: "relative", overflow: "hidden" }}>
                        <div style={{
                          position: "absolute", left: 0, top: 0, height: "100%",
                          width: `${Math.min((mine / (Math.max(ref, mine, 1))) * 100, 100)}%`,
                          background: meilleur ? "#22C55E" : colors.accent,
                          borderRadius: 4,
                        }} />
                        <div style={{
                          position: "absolute", left: `${Math.min((ref / (Math.max(ref, mine, 1))) * 100, 100)}%`,
                          top: -2, width: 2, height: 10, background: "#fff", opacity: 0.5,
                        }} />
                      </div>
                      <div style={{ fontSize: 11, color: colors.textMuted, width: 70 }}>réf: {ref}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── Feuille de route si hors Top 5 ── */}
      {!estDansLeTop5 && statsJoueur.length > 0 && placeAuPoste?.joueur && (
        <div style={{ background: colors.card, border: `1px solid ${colors.accent}44`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontFamily: fontTitle, fontSize: 18, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            🎯 Feuille de route vers le Top 5
          </h3>
          <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.7 }}>
            À ton poste ({profilActif.poste}), {placeAuPoste.joueur.prenom} occupe actuellement la place. Pour le rejoindre,
            concentre-toi sur les statistiques où l'écart est le plus visible dans le tableau ci-dessus. Pose une question à ton{" "}
            <strong style={{ color: colors.accent }}>Coach IA</strong> dans l'onglet Chat pour une feuille de route détaillée et personnalisée.
          </p>
        </div>
      )}

      {estDansLeTop5 && statsJoueur.length > 0 && (
        <div style={{ background: colors.card, border: `1px solid rgba(34,197,94,0.3)`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontFamily: fontTitle, fontSize: 18, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            💪 Axe de progression
          </h3>
          <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.7 }}>
            Tu es dans le Top 5 ce mois-ci — excellent travail. Pour consolider ta place, discute avec le{" "}
            <strong style={{ color: colors.accent }}>Coach IA</strong> dans l'onglet Chat : il analysera tes statistiques les plus faibles
            par rapport à ton poste pour te donner un axe d'amélioration concret.
          </p>
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// VUE 3 — CHAT ASSISTANT COACH
// ═════════════════════════════════════════════════════════════════════════
function ChatCoach({
  profilActif, stats, top5Resume, joueurs, onSelectProfil,
}: {
  profilActif: Joueur | null;
  stats: MatchStat[];
  top5Resume: { poste: string; nom: string; score: number }[];
  joueurs: Joueur[];
  onSelectProfil: (id: string) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const selectStyle = {
    width: "100%",
    maxWidth: 360,
    background: colors.bg,
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    padding: "10px 14px",
    color: colors.text,
    fontSize: 14,
    fontFamily: fontBody,
    outline: "none",
    marginBottom: 20,
  };

  if (!profilActif) {
    return (
      <div>
        <p style={{ color: colors.textMuted, marginBottom: 12, fontSize: 14 }}>
          Sélectionne ton profil pour parler avec le Coach IA — il connaîtra automatiquement tes statistiques.
        </p>
        <select style={selectStyle} onChange={(e) => onSelectProfil(e.target.value)} defaultValue="">
          <option value="" disabled>-- Choisir un joueur --</option>
          {joueurs.map((j) => (
            <option key={j.id} value={j.id}>{j.prenom} {j.nom} — {j.poste}</option>
          ))}
        </select>
      </div>
    );
  }

  const envoyerMessage = async () => {
    const texte = input.trim();
    if (!texte || loading) return;

    const nouveauxMessages: ChatMessage[] = [...messages, { role: "user", content: texte }];
    setMessages(nouveauxMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const statsJoueur = stats.filter((s) => s.joueurId === profilActif.id);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: texte,
          joueur: profilActif,
          statsJoueur,
          top5Resume,
          historique: nouveauxMessages.slice(0, -1),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || "Erreur lors de la communication avec le Coach IA.");
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (e: any) {
      setError(e.message || "Une erreur est survenue. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Pourquoi je ne suis pas dans le Top 5 ?",
    "Comment améliorer mon shoot ?",
    "Quel est mon point fort actuel ?",
    "Comment progresser à mon poste ?",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 600 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, background: "rgba(249,115,22,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>🤖</div>
        <div>
          <div style={{ fontFamily: fontTitle, fontSize: 18, fontWeight: 700 }}>Coach IA</div>
          <div style={{ fontSize: 12, color: colors.textMuted }}>
            Connecté en tant que {profilActif.prenom} {profilActif.nom} ({profilActif.poste})
          </div>
        </div>
        <button
          onClick={() => onSelectProfil("")}
          style={{
            marginLeft: "auto", background: "transparent", border: `1px solid ${colors.border}`,
            color: colors.textMuted, borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer",
          }}
        >
          Changer de profil
        </button>
      </div>

      {/* ── Zone de messages ── */}
      <div
        ref={scrollRef}
        style={{
          flex: 1, background: colors.card, border: `1px solid ${colors.border}`,
          borderRadius: 16, padding: 20, overflowY: "auto", marginBottom: 14,
          display: "flex", flexDirection: "column", gap: 12,
        }}
      >
        {messages.length === 0 && (
          <div>
            <p style={{ color: colors.textMuted, fontSize: 14, marginBottom: 16, lineHeight: 1.7 }}>
              👋 Salut {profilActif.prenom} ! Je suis ton Coach IA. Je connais déjà tes statistiques — pose-moi une question
              pour analyser ta performance ou demande comment progresser.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  style={{
                    textAlign: "left", background: colors.bg, border: `1px solid ${colors.border}`,
                    color: colors.text, borderRadius: 10, padding: "10px 14px", fontSize: 13,
                    cursor: "pointer", fontFamily: fontBody,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            maxWidth: "85%",
            background: m.role === "user" ? colors.accent : colors.bg,
            color: m.role === "user" ? "#fff" : colors.text,
            borderRadius: 12,
            padding: "10px 14px",
            fontSize: 14,
            lineHeight: 1.6,
            border: m.role === "assistant" ? `1px solid ${colors.border}` : "none",
            whiteSpace: "pre-wrap",
          }}>
            {m.content}
          </div>
        ))}

        {loading && (
          <div style={{
            alignSelf: "flex-start", background: colors.bg, border: `1px solid ${colors.border}`,
            borderRadius: 12, padding: "10px 14px", fontSize: 14, color: colors.textMuted,
          }}>
            Le Coach IA réfléchit...
          </div>
        )}

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
            color: "#FCA5A5", borderRadius: 10, padding: "10px 14px", fontSize: 13,
          }}>
            ❌ {error}
          </div>
        )}
      </div>

      {/* ── Zone de saisie ── */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && envoyerMessage()}
          placeholder="Pose ta question au Coach IA..."
          disabled={loading}
          style={{
            flex: 1, background: colors.card, border: `1px solid ${colors.border}`,
            borderRadius: 10, padding: "12px 16px", color: colors.text, fontSize: 14,
            fontFamily: fontBody, outline: "none",
          }}
        />
        <button
          onClick={envoyerMessage}
          disabled={loading || !input.trim()}
          style={{
            background: colors.accent, color: "white", border: "none", borderRadius: 10,
            padding: "12px 24px", fontFamily: fontTitle, fontSize: 16, fontWeight: 900,
            letterSpacing: 1, cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            opacity: loading || !input.trim() ? 0.5 : 1,
          }}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
