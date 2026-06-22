import { createClient } from "@supabase/supabase-js";

// On récupère les clés en prévoyant une valeur vide par défaut pour éviter de faire planter le build Next.js
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(url, key);