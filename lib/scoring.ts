// ─────────────────────────────────────────────────────────────────────────
// Logique de scoring partagée — utilisée par la page Top 5
// ─────────────────────────────────────────────────────────────────────────

export interface Joueur {
  id: string;
  nom: string;
  prenom: string;
  surnom?: string;
  numero: string;
  poste: "Meneur" | "Arrière" | "Ailier" | "Ailier Fort" | "Pivot";
  instagram?: string;  // ← ajouter
  tiktok?: string;     // ← ajouter
}

export interface MatchStat {
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

export const POSTES = ["Meneur", "Arrière", "Ailier", "Ailier Fort", "Pivot"] as const;

export const POSTE_COLORS: Record<string, string> = {
  Meneur: "#A78BFA",
  Arrière: "#5EEAD4",
  Ailier: "#93C5FD",
  "Ailier Fort": "#FCA5A5",
  Pivot: "#FB923C",
};

// Pondération par poste — reflète les responsabilités réelles sur le terrain
const POSTE_WEIGHTS: Record<string, Record<string, number>> = {
  Meneur:        { passes: 0.40, points: 0.25, interceptions: 0.20, turnovers: -0.15 },
  Arrière:       { points: 0.35, interceptions: 0.25, passes: 0.25, turnovers: -0.15 },
  Ailier:        { points: 0.30, rebonds: 0.25, interceptions: 0.20, passes: 0.25 },
  "Ailier Fort": { rebonds: 0.35, points: 0.25, contres: 0.25, turnovers: -0.15 },
  Pivot:         { rebonds: 0.35, contres: 0.30, points: 0.20, turnovers: -0.15 },
};

// Valeurs de référence pour normaliser chaque statistique sur une base 0-100
const MAX_REF: Record<string, number> = {
  points: 40, rebonds: 20, passes: 15, contres: 8, interceptions: 8, turnovers: 8,
};

export function moyenneStat(stats: MatchStat[], joueurId: string, key: keyof MatchStat): number {
  const s = stats.filter((m) => m.joueurId === joueurId);
  if (!s.length) return 0;
  const total = s.reduce((sum, m) => sum + Number(m[key] || 0), 0);
  return Math.round((total / s.length) * 10) / 10;
}

// Score "brut" simple (somme des stats positives moins les pertes de balle)
// — c'est la note d'évaluation mathématique standard demandée
export function scoreEvaluationBrute(joueur: Joueur, stats: MatchStat[]): number {
  const matchs = stats.filter((s) => s.joueurId === joueur.id);
  if (!matchs.length) return 0;
  const total = matchs.reduce((sum, m) => {
    return sum + m.points + m.rebonds + m.passes + m.interceptions + m.contres - m.turnovers;
  }, 0);
  return Math.round((total / matchs.length) * 10) / 10;
}

// Score pondéré par poste, normalisé sur 100 — utilisé pour le classement Top 5
export function scorePondereParPoste(joueur: Joueur, stats: MatchStat[]): number {
  const matchs = stats.filter((s) => s.joueurId === joueur.id);
  if (!matchs.length) return 0;

  const weights = POSTE_WEIGHTS[joueur.poste] || {};
  let score = 0;

  for (const [key, weight] of Object.entries(weights)) {
    const moyenne = matchs.reduce((sum, m) => sum + Number((m as any)[key] || 0), 0) / matchs.length;
    const normalise = Math.min(moyenne / (MAX_REF[key] || 1), 1) * 100;
    score += normalise * Math.abs(weight) * (weight < 0 ? -1 : 1);
  }

  return Math.max(0, Math.round(score));
}

export interface TopJoueur {
  poste: string;
  joueur: Joueur | null;
  score: number;
  scoreBrut: number;
}

export function calculerTop5(joueurs: Joueur[], stats: MatchStat[]): TopJoueur[] {
  return POSTES.map((poste) => {
    const candidats = joueurs.filter((j) => j.poste === poste);
    if (!candidats.length) {
      return { poste, joueur: null, score: 0, scoreBrut: 0 };
    }

    const meilleur = candidats.reduce((prev, curr) =>
      scorePondereParPoste(curr, stats) > scorePondereParPoste(prev, stats) ? curr : prev
    );

    const score = scorePondereParPoste(meilleur, stats);
    const scoreBrut = scoreEvaluationBrute(meilleur, stats);

    // Si le joueur n'a aucun match, on ne le considère pas comme "dans le Top 5"
    const aDesStats = stats.some((s) => s.joueurId === meilleur.id);

    return {
      poste,
      joueur: aDesStats ? meilleur : null,
      score: aDesStats ? score : 0,
      scoreBrut: aDesStats ? scoreBrut : 0,
    };
  });
}

// Moyennes du Top 5 par statistique — utilisé pour comparer un joueur hors Top 5
export function moyennesDuTop5(top5: TopJoueur[], stats: MatchStat[]) {
  const joueursTop5 = top5.filter((t) => t.joueur !== null).map((t) => t.joueur!) as Joueur[];
  if (!joueursTop5.length) {
    return { points: 0, rebonds: 0, passes: 0, interceptions: 0, contres: 0, turnovers: 0 };
  }

  const keys: (keyof MatchStat)[] = ["points", "rebonds", "passes", "interceptions", "contres", "turnovers"];
  const result: Record<string, number> = {};

  keys.forEach((key) => {
    const total = joueursTop5.reduce((sum, j) => sum + moyenneStat(stats, j.id, key), 0);
    result[key] = Math.round((total / joueursTop5.length) * 10) / 10;
  });

  return result as Record<"points" | "rebonds" | "passes" | "interceptions" | "contres" | "turnovers", number>;
}

// Analyse textuelle générée localement (fallback si l'IA n'est pas appelée)
// — donne une explication immédiate sans latence réseau, l'IA peut enrichir ensuite
export function analyseLocalePourPoste(joueur: Joueur, stats: MatchStat[]): string {
  const pts = moyenneStat(stats, joueur.id, "points");
  const reb = moyenneStat(stats, joueur.id, "rebonds");
  const pds = moyenneStat(stats, joueur.id, "passes");
  const ctr = moyenneStat(stats, joueur.id, "contres");
  const int = moyenneStat(stats, joueur.id, "interceptions");

  const analyses: Record<string, string> = {
    Meneur: `${joueur.prenom} orchestre le jeu avec ${pds} passes décisives par match et ${int} interceptions. Sa capacité à faire jouer ses coéquipiers tout en limitant les pertes de balle en fait le meilleur organisateur de l'équipe ce mois-ci.`,
    Arrière: `${joueur.prenom} s'impose offensivement avec ${pts} points par match. Sa capacité à scorer dans différentes situations et à peser sur la défense adverse justifie sa place de meilleur arrière du mois.`,
    Ailier: `${joueur.prenom} affiche un profil complet : ${pts} pts, ${reb} rebonds et ${pds} passes par match. Cette polyvalence rare en fait l'ailier le plus utile à l'équipe actuellement.`,
    "Ailier Fort": `${joueur.prenom} domine physiquement avec ${reb} rebonds et ${ctr} contres par match. Sa présence dans la raquette pèse autant en attaque qu'en défense.`,
    Pivot: `${joueur.prenom} contrôle la raquette avec ${reb} rebonds et ${ctr} contres par match. Son impact défensif intérieur est le facteur clé de sa sélection.`,
  };

  return analyses[joueur.poste] || `${joueur.prenom} affiche les meilleures statistiques pondérées à son poste ce mois-ci.`;
}