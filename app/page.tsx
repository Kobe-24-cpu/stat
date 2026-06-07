"use client";

import { useState, useEffect } from "react";

// Types pour sécuriser nos données
interface Joueur {
  id: string;
  nom: string;
  prenom: string;
  numero: string;
  poste: "Meneur" | "Arrière" | "Ailier" | "Ailier Fort" | "Pivot";
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
}

export default function Home() {
  // --- ÉTATS (STATES) ---
  const [joueurs, setJoueurs] = useState<Joueur[]>([]);
  const [stats, setStats] = useState<MatchStat[]>([]);
  const [topFive, setTopFive] = useState<Record<string, Joueur | null>>({
    Meneur: null,
    Arrière: null,
    Ailier: null,
    "Ailier Fort": null,
    Pivot: null,
  });

  // États pour les formulaires
  const [newNom, setNewNom] = useState("");
  const [newPrenom, setNewPrenom] = useState("");
  const [newNumero, setNewNumero] = useState("");
  const [newPoste, setNewPoste] = useState<Joueur["poste"]>("Meneur");

  // États pour la saisie de match
  const [selectedJoueur, setSelectedJoueur] = useState("");
  const [pts, setPts] = useState(0);
  const [ast, setAst] = useState(0);
  const [reb, setReb] = useState(0);
  const [stl, setStl] = useState(0);
  const [blk, setBlk] = useState(0);
  const [to, setTo] = useState(0);

  // --- LOCALSTORAGE (Persistance des données) ---
  useEffect(() => {
    const savedJoueurs = localStorage.getItem("hoop_joueurs");
    const savedStats = localStorage.getItem("hoop_stats");
    if (savedJoueurs) setJoueurs(JSON.parse(savedJoueurs));
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  useEffect(() => {
    localStorage.setItem("hoop_joueurs", JSON.stringify(joueurs));
    calculerTopCinq();
  }, [joueurs]);

  useEffect(() => {
    localStorage.setItem("hoop_stats", JSON.stringify(stats));
    calculerTopCinq();
  }, [stats]);

  // --- LOGIQUE IA / ALGORITHME DU TOP 5 ---
  const calculerTopCinq = () => {
    const postes: Joueur["poste"][] = ["Meneur", "Arrière", "Ailier", "Ailier Fort", "Pivot"];
    const nouveauTop: Record<string, Joueur | null> = {};

    postes.forEach((poste) => {
      const joueursDuPoste = joueurs.filter((j) => j.poste === poste);
      let meilleurJoueur: Joueur | null = null;
      let meilleureEfficacite = -999;

      joueursDuPoste.forEach((joueur) => {
        const matchesDuJoueur = stats.filter((s) => s.joueurId === joueur.id);
        if (matchesDuJoueur.length === 0) return;

        // Calcul du score moyen basé sur les critères du poste
        let scoreTotal = 0;
        matchesDuJoueur.forEach((m) => {
          let base = m.points + m.passes + m.rebonds + m.interceptions + m.contres - m.turnovers;
          
          // Coefficients de l'IA selon le poste
          if (poste === "Meneur") base += m.passes * 0.5 - m.turnovers * 0.5;
          if (poste === "Pivot") base += m.rebonds * 0.5 + m.contres * 0.5;
          if (poste === "Arrière") base += m.points * 0.3;
          
          scoreTotal += base;
        });

        const efficatiteMoyenne = scoreTotal / matchesDuJoueur.length;
        if (efficatiteMoyenne > meilleureEfficacite) {
          meilleureEfficacite = efficatiteMoyenne;
          meilleurJoueur = joueur;
        }
      });

      nouveauTop[poste] = meilleurJoueur;
    });

    setTopFive(nouveauTop);
  };

  // --- ACTIONS ---
  const ajouterJoueur = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNom || !newPrenom || !newNumero) return;

    const joueur: Joueur = {
      id: Date.now().toString(),
      nom: newNom.toUpperCase(),
      prenom: newPrenom,
      numero: newNumero,
      poste: newPoste,
    };

    setJoueurs([...joueurs, joueur]);
    setNewNom("");
    setNewPrenom("");
    setNewNumero("");
  };

  const ajouterMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJoueur) return;

    const nouvelleStat: MatchStat = {
      id: Date.now().toString(),
      joueurId: selectedJoueur,
      points: Number(pts),
      passes: Number(ast),
      rebonds: Number(reb),
      interceptions: Number(stl),
      contres: Number(blk),
      turnovers: Number(to),
      date: new Date().toLocaleDateString(),
    };

    setStats([...stats, nouvelleStat]);
    setPts(0); setAst(0); setReb(0); setStl(0); setBlk(0); setTo(0);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur p-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-wider text-orange-500">HOOP STATS <span className="text-white bg-orange-600 px-2 py-0.5 rounded text-sm font-bold align-middle ml-1">AI</span></h1>
          <p className="text-sm text-slate-400">Total Joueurs : {joueurs.length}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE 1 & 2 : TABLEAU DE BORD & ENTRÉE DES MATCHS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* SECTION : LE 5 MAJEUR DU MOIS (GÉNÉRÉ PAR L'IA) */}
          <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full filter blur-3xl -z-10"></div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-orange-400">
              <span>🏀</span> 5 Majeur du Mois (Analyse IA)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {(["Meneur", "Arrière", "Ailier", "Ailier Fort", "Pivot"] as const).map((poste) => (
                <div key={poste} className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl text-center flex flex-col justify-between h-36">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{poste}</span>
                  {topFive[poste] ? (
                    <div>
                      <p className="font-bold text-orange-500 text-sm truncate">{topFive[poste]?.prenom}</p>
                      <p className="text-xs text-slate-400">#{topFive[poste]?.numero}</p>
                    </div>
                  ) : (
                    <p className="text-xs italic text-slate-600">Aucune donnée</p>
                  )}
                  <div className="h-1 w-full bg-orange-600/20 rounded-full overflow-hidden">
                    {topFive[poste] && <div className="h-full w-full bg-orange-500 animate-pulse"></div>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION : ENTRER LES STATS D'UN MATCH */}
          <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>📝</span> Enregistrer les stats d'un match
            </h2>
            <form onSubmit={ajouterMatch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Sélectionner le joueur</label>
                <select 
                  value={selectedJoueur} 
                  onChange={(e) => setSelectedJoueur(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 focus:outline-none focus:border-orange-500"
                  required
                >
                  <option value="">-- Choisir un joueur --</option>
                  {joueurs.map((j) => (
                    <option key={j.id} value={j.id}>{j.prenom} {j.nom} ({j.poste} #{j.numero})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                {[
                  { label: "Points", val: pts, set: setPts },
                  { label: "Passes", val: ast, set: setAst },
                  { label: "Rebonds", val: reb, set: setReb },
                  { label: "Inter", val: stl, set: setStl },
                  { label: "Contres", val: blk, set: setBlk },
                  { label: "Balles Perdues", val: to, set: setTo },
                ].map((stat, idx) => (
                  <div key={idx}>
                    <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1 truncate">{stat.label}</label>
                    <input 
                      type="number" 
                      min="0"
                      value={stat.val} 
                      onChange={(e) => stat.set(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-center focus:outline-none focus:border-orange-500" 
                    />
                  </div>
                ))}
              </div>

              <button 
                type="submit" 
                disabled={!selectedJoueur || joueurs.length === 0}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition disabled:opacity-20"
              >
                Sauvegarder les statistiques du match
              </button>
            </form>
          </section>
        </div>

        {/* COLONNE 3 : AJOUTER UN JOUEUR & EFFECTIF */}
        <div className="space-y-8">
          
          {/* FORMULAIRE : CRÉER UN JOUEUR */}
          <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>➕</span> Ajouter un nouveau joueur
            </h2>
            <form onSubmit={ajouterJoueur} className="flex flex-col gap-3">
              <input 
                type="text" 
                placeholder="Prénom" 
                value={newPrenom} 
                onChange={(e) => setNewPrenom(e.target.value)} 
                className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 focus:outline-none focus:border-orange-500" 
                required 
              />
              <input 
                type="text" 
                placeholder="Nom" 
                value={newNom} 
                onChange={(e) => setNewNom(e.target.value)} 
                className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 focus:outline-none focus:border-orange-500" 
                required 
              />
              <input 
                type="number" 
                placeholder="Numéro de maillot (ex: 23)" 
                value={newNumero} 
                onChange={(e) => setNewNumero(e.target.value)} 
                className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 focus:outline-none focus:border-orange-500" 
                required 
              />
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold uppercase">Poste sur le terrain</label>
                <select 
                  value={newPoste} 
                  onChange={(e) => setNewPoste(e.target.value as Joueur["poste"])}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="Meneur">Meneur (PG)</option>
                  <option value="Arrière">Arrière (SG)</option>
                  <option value="Ailier">Ailier (SF)</option>
                  <option value="Ailier Fort">Ailier Fort (PF)</option>
                  <option value="Pivot">Pivot (C)</option>
                </select>
              </div>
              <button type="submit" className="bg-slate-100 hover:bg-white text-slate-950 font-bold py-3 rounded-xl transition mt-2">
                Enregistrer le joueur
              </button>
            </form>
          </section>

          {/* LISTE RAPIDE DES JOUEURS ENREGISTRÉS */}
          <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl max-h-72 overflow-y-auto">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Liste de l'effectif</h3>
            {joueurs.length === 0 ? (
              <p className="text-xs italic text-slate-600">Aucun joueur enregistré pour le moment.</p>
            ) : (
              <div className="space-y-2">
                {joueurs.map((j) => (
                  <div key={j.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800/50 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold">{j.prenom} {j.nom}</p>
                      <p className="text-[11px] text-orange-400 font-medium">{j.poste}</p>
                    </div>
                    <span className="bg-slate-900 text-slate-400 px-2 py-1 rounded text-xs font-mono">#{j.numero}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}