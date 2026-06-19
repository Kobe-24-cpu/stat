import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────
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

interface Joueur {
  id: string;
  nom: string;
  prenom: string;
  surnom?: string;
  numero: string;
  poste: "Meneur" | "Arrière" | "Ailier" | "Ailier Fort" | "Pivot";
}

interface ChatRequestBody {
  message: string;
  joueur: Joueur;
  statsJoueur: MatchStat[];
  top5Resume?: { poste: string; nom: string; score: number }[];
  historique?: { role: "user" | "assistant"; content: string }[];
}

// ─────────────────────────────────────────────────────────────────────────
// Helpers statistiques
// ─────────────────────────────────────────────────────────────────────────
function moyenne(stats: MatchStat[], key: keyof MatchStat): number {
  if (!stats.length) return 0;
  const total = stats.reduce((sum, m) => sum + Number(m[key] || 0), 0);
  return Math.round((total / stats.length) * 10) / 10;
}

function construireContexteJoueur(joueur: Joueur, stats: MatchStat[]): string {
  if (!stats.length) {
    return `${joueur.prenom} ${joueur.nom} (${joueur.poste}, #${joueur.numero}) n'a encore aucun match enregistré dans le système.`;
  }

  const m = {
    points: moyenne(stats, "points"),
    rebonds: moyenne(stats, "rebonds"),
    passes: moyenne(stats, "passes"),
    interceptions: moyenne(stats, "interceptions"),
    contres: moyenne(stats, "contres"),
    turnovers: moyenne(stats, "turnovers"),
  };

  const tries = [...stats].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const dernierMatch = tries[tries.length - 1];

  let tendance = "";
  if (tries.length >= 4) {
    const recents = tries.slice(-3);
    const anciens = tries.slice(0, -3);
    const ptsRecents = moyenne(recents, "points");
    const ptsAnciens = moyenne(anciens, "points");
    const toRecents = moyenne(recents, "turnovers");
    const toAnciens = moyenne(anciens, "turnovers");

    if (ptsRecents > ptsAnciens) {
      tendance += `Sa moyenne de points progresse récemment (${ptsAnciens} → ${ptsRecents} sur les 3 derniers matchs). `;
    } else if (ptsRecents < ptsAnciens) {
      tendance += `Sa moyenne de points est en baisse récemment (${ptsAnciens} → ${ptsRecents} sur les 3 derniers matchs). `;
    }
    if (toRecents < toAnciens) {
      tendance += `Ses pertes de balle diminuent (${toAnciens} → ${toRecents}), signe d'une meilleure gestion du ballon. `;
    } else if (toRecents > toAnciens) {
      tendance += `Ses pertes de balle augmentent (${toAnciens} → ${toRecents}), point à corriger. `;
    }
  }

  return `
Profil du joueur : ${joueur.prenom} ${joueur.nom}${joueur.surnom ? ` (surnom: "${joueur.surnom}")` : ""}, poste ${joueur.poste}, numéro #${joueur.numero}.
Nombre de matchs enregistrés : ${stats.length}.
Moyennes par match : ${m.points} points, ${m.rebonds} rebonds, ${m.passes} passes décisives, ${m.interceptions} interceptions, ${m.contres} contres, ${m.turnovers} pertes de balle.
Dernier match : ${dernierMatch.points} pts, ${dernierMatch.rebonds} reb, ${dernierMatch.passes} pds contre ${dernierMatch.adversaire} (${dernierMatch.resultat}).
${tendance ? "Tendance récente : " + tendance : ""}
`.trim();
}

function construireContexteTop5(top5?: { poste: string; nom: string; score: number }[]): string {
  if (!top5 || !top5.length) return "Aucune donnée de Top 5 disponible actuellement.";
  return "Top 5 actuel du mois :\n" + top5.map((t) => `- ${t.poste} : ${t.nom} (score IA: ${t.score}/100)`).join("\n");
}

// ─────────────────────────────────────────────────────────────────────────
// Prompt système : c'est ici que l'IA devient un vrai "Coach"
// ─────────────────────────────────────────────────────────────────────────
function construirePromptSysteme(joueur: Joueur, stats: MatchStat[], top5?: { poste: string; nom: string; score: number }[]): string {
  const contexteJoueur = construireContexteJoueur(joueur, stats);
  const contexteTop5 = construireContexteTop5(top5);

  return `Tu es "Coach IA", l'assistant basketball officiel de la plateforme ApexUT. Tu parles en français, avec le ton d'un coach exigeant mais bienveillant — direct, concret, jamais vague.

RÔLES CLÉS DES POSTES (utilise ces critères pour juger les performances) :
- Meneur (PG) : vision de jeu, passes décisives, gestion du ballon (peu de pertes), capacité à créer pour les autres.
- Arrière (SG) : scoring, adresse au tir, capacité à créer son propre tir, défense sur l'extérieur.
- Ailier (SF) : polyvalence complète — scoring, rebonds, défense, passes. Le "couteau suisse" de l'équipe.
- Ailier Fort (PF) : présence physique, rebonds (offensifs et défensifs), contres, jeu près du cercle.
- Pivot (C) : domination dans la raquette, rebonds, contres, présence défensive intérieure.

CONTEXTE DU JOUEUR QUI TE PARLE :
${contexteJoueur}

${contexteTop5}

INSTRUCTIONS DE RÉPONSE :
1. Réponds TOUJOURS en te basant sur les vraies statistiques ci-dessus, jamais de généralités vagues.
2. Si le joueur demande pourquoi il n'est pas dans le Top 5, compare directement ses moyennes à celles du joueur du Top 5 à son poste (si disponible) et donne 2-3 axes concrets et chiffrés.
3. Si le joueur demande comment progresser, donne des conseils techniques et tactiques adaptés à SON poste précis, pas génériques.
4. Sois encourageant mais honnête — un vrai coach ne flatte pas, il pousse à s'améliorer.
5. Reste concis : 3 à 6 phrases maximum, sauf si la question demande clairement plus de détails.
6. N'invente jamais de statistiques qui ne sont pas dans le contexte fourni.`;
}

// ─────────────────────────────────────────────────────────────────────────
// Route POST — utilise l'API Groq (gratuite, ultra-rapide)
// Doc : https://console.groq.com/docs/quickstart
// ─────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json();
    const { message, joueur, statsJoueur, top5Resume, historique } = body;

    if (!message || !joueur) {
      return NextResponse.json(
        { error: "Message et profil joueur requis." },
        { status: 400 }
      );
    }

    const systemPrompt = construirePromptSysteme(joueur, statsJoueur || [], top5Resume);

    const messages = [
      { role: "system", content: systemPrompt },
      ...(historique || []).map((h) => ({ role: h.role, content: h.content })),
      { role: "user", content: message },
    ];

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Clé API Groq non configurée sur le serveur (GROQ_API_KEY)." },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        // Modèle gratuit, rapide et performant sur Groq
        model: "llama-3.3-70b-versatile",
        messages,
        max_tokens: 600,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Erreur API Groq:", errText);
      return NextResponse.json(
        { error: "Erreur lors de l'appel à l'IA. Réessaie dans un instant." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const texteReponse =
      data.choices?.[0]?.message?.content ||
      "Je n'ai pas pu générer de réponse, réessaie ta question.";

    return NextResponse.json({ reply: texteReponse });
  } catch (error) {
    console.error("Erreur route /api/chat:", error);
    return NextResponse.json(
      { error: "Erreur serveur inattendue." },
      { status: 500 }
    );
  }
}