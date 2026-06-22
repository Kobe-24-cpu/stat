import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Client créé en lazy — évite l'erreur de pré-rendu Next.js
// car les variables NEXT_PUBLIC_* ne sont pas disponibles au moment
// où Next.js analyse les modules côté serveur pendant le build.
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Variables Supabase manquantes : NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  _client = createClient(url, key);
  return _client;
}

// Export direct pour compatibilité avec le code existant
// À utiliser UNIQUEMENT dans des fonctions/hooks (pas au niveau module)
export const supabase = {
  from: (table: string) => getSupabase().from(table),
  auth: {
    getUser: () => getSupabase().auth.getUser(),
  },
};