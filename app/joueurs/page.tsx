"use client";
import { useState } from "react";

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

export default function JoueursPage() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [surnom, setSurnom] = useState("");
  const [numero, setNumero] = useState("");
  const [poste, setPoste] = useState<PendingJoueur["poste"]>("Meneur");
  const [age, setAge] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
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

  const handleAgeChange = (val: string) => {
    if (val === "") { setAge(""); return; }
    const num = Math.min(40, Math.max(0, Number(val)));
    setAge(num.toString());
  };

  const envoyer = () => {
    // CORRECTION : Alerte claire si des champs obligatoires sont vides
    if (!nom.trim() || !prenom.trim() || !numero.trim()) {
      alert("⚠️ Veuillez remplir le Prénom, le Nom et le Numéro de maillot !");
      return;
    }

    const pending: PendingJoueur = {
      id: Date.now().toString(),
      nom: nom.trim().toUpperCase(),
      prenom: prenom.trim(),
      surnom: surnom.trim(),
      numero: numero.trim(),
      poste,
      age,
      instagram: instagram.trim(),
      tiktok: tiktok.trim(),
      dateInscription: new Date().toLocaleDateString("fr-FR"),
      statut: "en_attente",
    };

    try {
      const existing = localStorage.getItem("hoop_pending");
      const list: PendingJoueur[] = existing ? JSON.parse(existing) : [];
      list.push(pending);
      localStorage.setItem("hoop_pending", JSON.stringify(list));
      
      // Confirmation visuelle du succès
      setSubmitted(true);
    } catch (e) {
      alert("Une erreur est survenue lors de l'enregistrement.");
      console.error(e);
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
            Ton profil a été transmis à l'administrateur pour validation.
            Une fois accepté, tu apparaîtras dans <strong style={{ color: "#F97316" }}>l'effectif officiel</strong> de l'équipe.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setNom(""); setPrenom(""); setSurnom(""); setNumero(""); setAge(""); setInstagram(""); setTiktok("");
            }}
            style={{
              marginTop: 28,
              background: "#F97316",
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: "12px 28px",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 1,
              cursor: "pointer",
            }}
          >
            INSCRIRE UN AUTRE JOUEUR
          </button>
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
          <p style={{ color: "#78716C", marginTop: 8, fontSize: 15 }}>
            Crée ton profil joueur. Une fois validé par l'administrateur,
            tu apparaîtras dans l'effectif et tes performances seront suivies par l'IA.
          </p>
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
              <label style={labelStyle}>
                Surnom
                <span style={optionalStyle}>optionnel</span>
              </label>
              <input style={inputStyle} placeholder="ex: Sniper, Kobe..." value={surnom} onChange={(e) => setSurnom(e.target.value)} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Numéro *</label>
                <input style={inputStyle} type="text" pattern="[0-9]*" placeholder="23" value={numero} onChange={(e) => setNumero(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>
                  Âge
                  <span style={optionalStyle}>optionnel</span>
                </label>
                <input
                  style={inputStyle}
                  type="number"
                  placeholder="20"
                  min={0}
                  max={40}
                  value={age}
                  onChange={(e) => handleAgeChange(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Poste sur le terrain</label>
              <select style={inputStyle} value={poste} onChange={(e) => setPoste(e.target.value as PendingJoueur["poste"])}>
                <option value="Meneur">Meneur (PG)</option>
                <option value="Arrière">Arrière (SG)</option>
                <option value="Ailier">Ailier (SF)</option>
                <option value="Ailier Fort">Ailier Fort (PF)</option>
                <option value="Pivot">Pivot (C)</option>
              </select>
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16, marginTop: 4 }}>
              <p style={{ fontSize: 11, color: "#78716C", marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>
                Réseaux sociaux <span style={optionalStyle}>optionnels</span>
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>📸 Instagram</label>
                  <input style={inputStyle} placeholder="pseudo (ex: kobe_24)" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>🎵 TikTok</label>
                  <input style={inputStyle} placeholder="pseudo (ex: kobe_tiktok)" value={tiktok} onChange={(e) => setTiktok(e.target.value)} />
                </div>
              </div>
            </div>

            <button
              onClick={envoyer}
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
              }}
            >
              ENVOYER MA DEMANDE →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}