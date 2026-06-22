"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function JoueursPage() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [surnom, setSurnom] = useState("");
  const [numero, setNumero] = useState("");
  const [poste, setPoste] = useState("Meneur (PG)");
  const [age, setAge] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const optionalStyle = {
    fontSize: 11,
    color: "#F5F5F4",
    fontWeight: 700,
    textTransform: "none" as const,
    letterSpacing: 0,
    marginLeft: 6,
    background: "rgba(255,255,255,0.08)",
    padding: "1px 7px",
    borderRadius: 4,
  };

  const envoyer = async () => {
    if (!nom.trim() || !prenom.trim() || !numero.trim()) {
      alert("⚠️ Veuillez remplir le Prénom, le Nom et le Numéro de maillot !");
      return;
    }

    setLoading(true);

    const nouvelleDemande = {
      id: crypto.randomUUID(),
      nom: nom.trim().toUpperCase(),
      prenom: prenom.trim(),
      surnom: surnom.trim() || null,
      numero: numero.trim(),
      poste,
      age: age.trim() || null,
      instagram: instagram.trim() || null,
      tiktok: tiktok.trim() || null,
      date_inscription: new Date().toLocaleDateString("fr-FR"),
      statut: "en_attente"
    };

    const { error } = await supabase.from("pending").insert([nouvelleDemande]);

    setLoading(false);

    if (error) {
      alert("Erreur lors de l'envoi : " + error.message);
      console.error(error);
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div style={{
        background: "#1C1917", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif", padding: 24,
      }}>
        <div style={{
          background: "#2C2925",
          border: "1px solid rgba(34,197,94,0.3)",
          borderRadius: 16,
          padding: 48,
          textAlign: "center",
          maxWidth: 480,
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 28,
            fontWeight: 900,
            color: "#F5F5F4",
            marginBottom: 12,
          }}>
            DEMANDE ENVOYÉE !
          </h2>
          <p style={{ color: "#A8A29E", fontSize: 15, lineHeight: 1.7 }}>
            Ton profil a été transmis à l'administrateur. Une fois accepté, tu apparaîtras dans l'effectif officiel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#1C1917", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", padding: "40px 24px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>

        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 48,
            fontWeight: 900,
            color: "#F5F5F4",
            lineHeight: 1,
          }}>
            REJOINS <span style={{ color: "#F97316" }}>L'ÉQUIPE</span>
          </h1>
        </div>

        <div style={{
          background: "#2C2925",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: 28,
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Prénom *</label>
                <input style={inputStyle} placeholder="ex: Baye Zalle" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Nom *</label>
                <input style={inputStyle} placeholder="ex: Goudiaby" value={nom} onChange={(e) => setNom(e.target.value)} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Surnom <span style={optionalStyle}>optionnel</span></label>
              <input style={inputStyle} placeholder="ex: Sniper" value={surnom} onChange={(e) => setSurnom(e.target.value)} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Numéro *</label>
                <input style={inputStyle} type="text" pattern="[0-9]*" placeholder="23" value={numero} onChange={(e) => setNumero(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Âge <span style={optionalStyle}>optionnel</span></label>
                <input style={inputStyle} type="number" placeholder="20" value={age} onChange={(e) => setAge(e.target.value)} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Poste sur le terrain</label>
              <select style={inputStyle} value={poste} onChange={(e) => setPoste(e.target.value)}>
                <option>Meneur (PG)</option>
                <option>Arrière (SG)</option>
                <option>Ailier (SF)</option>
                <option>Ailier Fort (PF)</option>
                <option>Pivot (C)</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 }}>
              <div>
                <label style={labelStyle}>📸 Instagram</label>
                <input style={inputStyle} placeholder="@username" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>🎵 TikTok</label>
                <input style={inputStyle} placeholder="@username" value={tiktok} onChange={(e) => setTiktok(e.target.value)} />
              </div>
            </div>

            <button
              onClick={envoyer}
              disabled={loading}
              style={{
                background: "#F97316",
                color: "white",
                border: "none",
                borderRadius: 10,
                padding: "14px",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 18,
                fontWeight: 900,
                letterSpacing: 1,
                cursor: "pointer",
                marginTop: 8,
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "ENVOI EN COURS..." : "ENVOY_ER MA DEMANDE →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
