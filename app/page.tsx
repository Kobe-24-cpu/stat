"use client";

import { useState, useEffect } from "react";

// Les données restent DEHORS (c'est correct)
const MANGAS = [
  { id: 1, titre: "One Piece - Tome 100", prix: "6.90€", image: "https://placehold.co/400x600?text=One+Piece" },
  { id: 2, titre: "Jujutsu Kaisen - Tome 0", prix: "6.95€", image: "https://placehold.co/400x600?text=Jujutsu+Kaisen" },
  { id: 3, titre: "Chainsaw Man - Tome 1", prix: "7.20€", image: "https://placehold.co/400x600?text=Chainsaw+Man" },
];

export default function Home() {
  // TOUS les hooks doivent être ICI (DANS la fonction)
  const [panier, setPanier] = useState("");

  useEffect(() => {
    const savedPanier = localStorage.getItem("panier");
    if (savedPanier) setPanier(savedPanier);
  }, []);

  useEffect(() => {
    if (panier) localStorage.setItem("panier", panier);
  }, [panier]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="border-b border-gray-200 bg-white p-5">
        <h1 className="text-2xl font-bold text-center">MANGA SUPER BOUTIQUE</h1>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {MANGAS.map((manga) => (
            <div key={manga.id} className="bg-white border p-4 rounded-xl shadow-sm">
              <img src={manga.image} alt={manga.titre} className="w-full rounded-md mb-4" />
              <h3 className="font-bold">{manga.titre}</h3>
              <p className="text-gray-500 mb-4">{manga.prix}</p>
              <button
                onClick={() => setPanier(manga.titre)}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
              >
                Ajouter au panier
              </button>
            </div>
          ))}
        </div>

        <section className="mt-16 max-w-lg mx-auto bg-white border p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">Finaliser l'achat</h2>
          <p className="mb-6 p-3 bg-yellow-50 rounded border border-yellow-200">
            {panier ? `Article prêt : ${panier}` : "🛒 Votre panier est vide."}
          </p>
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Nom complet" className="border p-3 rounded-lg" required />
            <input type="tel" placeholder="Téléphone" className="border p-3 rounded-lg" required />
            <button 
                type="submit" 
                disabled={!panier} 
                className="bg-green-600 text-white py-3 rounded-lg font-bold disabled:opacity-30"
            >
              Confirmer la commande
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}