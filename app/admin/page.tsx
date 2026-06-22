"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [demandes, setDemandes] = useState<any[]>([]);
  const [joueurs, setJoueurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les données depuis Supabase dès que la page s'ouvre
  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    setLoading(true);
    
    // 1. Récupérer les demandes en attente
    const { data: pendingData } = await supabase
      .from("pending")
      .select("*")
      .eq("statut", "en_attente")
      .order("created_at", { ascending: false });

    // 2. Récupérer l'effectif officiel
    const { data: joueursData } = await supabase
      .from("joueurs")
      .select("*")
      .order("nom", { ascending: true });

    if (pendingData) setDemandes(pendingData);
    if (joueursData) setJoueurs(joueursData);
    setLoading(false);
  };

  // Accepter un joueur
  const accepterJoueur = async (demande: any) => {
    // a. Insérer le joueur dans la table officielle
    const { error: insertError } = await supabase.from("joueurs").insert([
      {
        id: demande.id,
        nom: demande.nom,
        prenom: demande.prenom,
        surnom: demande.surnom,
        numero: demande.numero,
        poste: demande.poste,
        age: demande.age,
        instagram: demande.instagram,
        tiktok: demande.tiktok,
      },
    ]);

    if (insertError) {
      alert("Erreur lors de l'acceptation : " + insertError.message);
      return;
    }

    // b. Supprimer la demande de la table temporaire
    await supabase.from("pending").delete().eq("id", demande.id);

    // c. Rafraîchir l'affichage
    chargerDonnees();
  };

  // Refuser un joueur
  const refuserJoueur = async (id: string) => {
    if (confirm("Supprimer définitivement cette demande d'inscription ?")) {
      await supabase.from("pending").delete().eq("id", id);
      chargerDonnees();
    }
  };

  // Supprimer un joueur de l'effectif officiel
  const supprimerJoueurOfficiel = async (id: string) => {
    if (confirm("Retirer ce joueur de l'effectif officiel ? (Cela effacera aussi ses stats)")) {
      await supabase.from("joueurs").delete().eq("id", id);
      chargerDonnees();
    }
  };

  if (loading) {
    return (
      <div style={{ background: "#1C1917", minHeight: "100vh", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <h2>Chargement du tableau de bord...</h2>
      </div>
    );
  }

  return (
    <div style={{ background: "#1C1917", minHeight: "100vh", color: "#F5F5F4", fontFamily: "'DM Sans', sans-serif", padding: 40 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 40, fontWeight: 900, marginBottom: 32, color: "#F97316" }}>
          🏀 SCRIPT ADMIN — GESTION DU CLUB
        </h1>

        {/* SECTION 1 : DEMANDES EN ATTENTE */}
        <div style={{ background: "#2C2925", borderRadius: 12, padding: 24, marginBottom: 40, border: "1px solid rgba(255,255,255,0.05)" }}>
          <h2 style={{ fontSize: 20, marginBottom: 16, color: "#E7E5E4", borderBottom: "2px solid #F97316", paddingBottom: 8 }}>
            📩 Inscriptions en attente ({demandes.length})
          </h2>
          
          {demandes.length === 0 ? (
            <p style={{ color: "#A8A29E", fontSize: 14 }}>Aucune nouvelle inscription pour le moment.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {demandes.map((d) => (
                <div key={d.id} style={{ background: "#1C1917", padding: 16, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>#{d.numero} {d.prenom} {d.nom}</span>
                    {d.surnom && <span style={{ color: "#F97316", marginLeft: 8 }}>({d.surnom})</span>}
                    <div style={{ fontSize: 13, color: "#A8A29E", marginTop: 4 }}>
                      Poste: {d.poste} | Âge: {d.age || "Non renseigné"} | Inscription: {d.date_inscription}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => accepterJoueur(d)} style={{ background: "#22C55E", color: "white", border: "none", padding: "8px 16px", borderRadius: 6, fontWeight: "bold", cursor: "pointer" }}>
                      ✅ Accepter
                    </button>
                    <button onClick={() => refuserJoueur(d.id)} style={{ background: "#EF4444", color: "white", border: "none", padding: "8px 16px", borderRadius: 6, fontWeight: "bold", cursor: "pointer" }}>
                      ❌ Refuser
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2 : EFFECTIF OFFICIEL */}
        <div style={{ background: "#2C2925", borderRadius: 12, padding: 24, border: "1px solid rgba(255,255,255,0.05)" }}>
          <h2 style={{ fontSize: 20, marginBottom: 16, color: "#E7E5E4", borderBottom: "2px solid #22C55E", paddingBottom: 8 }}>
            👥 Effectif Officiel de l'Équipe ({joueurs.length})
          </h2>

          {joueurs.length === 0 ? (
            <p style={{ color: "#A8A29E", fontSize: 14 }}>Aucun joueur validé dans l'effectif pour le moment.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {joueurs.map((j) => (
                <div key={j.id} style={{ background: "#1C1917", padding: 16, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: 16, fontWeight: "bold" }}>#{j.numero} — {j.prenom} {j.nom}</span>
                    <span style={{ fontSize: 13, color: "#A8A29E", marginLeft: 12 }}>({j.poste})</span>
                  </div>
                  <button onClick={() => supprimerJoueurOfficiel(j.id)} style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid #EF4444", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
                    Retirer du club
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}