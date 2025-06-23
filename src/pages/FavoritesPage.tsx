// src/pages/FavoritesPage.tsx
import React, { useState, useEffect } from "react";
import FilmCard from "../components/FilmCard";
import type { Film } from "../types/Film";
import { useFilmContext } from "../context/FilmContext";
import "./FavoritesPage.css";  // ← CSS’i import ettiğimize emin olun

interface FavoritesPageProps {
  onFilmSelect: (film: Film) => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ onFilmSelect }) => {
  const { favorites, removeFromFavorites } = useFilmContext();

  const [sortBy, setSortBy] = useState<"dateAdded" | "title" | "year" | "rating">("dateAdded");
  const [filterBy, setFilterBy] = useState<string>("Tümü");
  const [sortedFavorites, setSortedFavorites] = useState<Film[]>([]);

  const genres = ["Tümü", ...Array.from(new Set(favorites.map(f => f.genre)))];

  useEffect(() => {
    let filtered = filterBy === "Tümü" ? favorites : favorites.filter(f => f.genre === filterBy);
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "title":   return a.title.localeCompare(b.title);
        case "year":    return b.year - a.year;
        case "rating":  return b.rating - a.rating;
        case "dateAdded":
        default:
          return new Date(b.dateAdded || "").getTime() - new Date(a.dateAdded || "").getTime();
      }
    });
    setSortedFavorites(sorted);
  }, [favorites, sortBy, filterBy]);

  if (favorites.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-black">
        <div className="text-center">
          <h2 className="text-3xl mb-4">Henüz Favorin Yok 💔</h2>
          <p>Film detayından kalp ikonuna tıklayarak favorilerine ekleyebilirsin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page px-4 py-10 mx-auto max-w-7xl space-y-6">
      {/* Başlık */}
      <h1 className="favorites-title">❤️ Favoriler</h1>

      {/* ⭐ YENİ FILTER BAR */}
      <div className="favorites-controls">
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
        >
          <option value="dateAdded">Eklenme Tarihi</option>
          <option value="title">Film Adı</option>
          <option value="year">Yıl</option>
          <option value="rating">Puan</option>
        </select>

        <select
          value={filterBy}
          onChange={e => setFilterBy(e.target.value)}
        >
          {genres.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Favori Kartları */}
      <div className="grid grid-cols-3 gap-8 place-items-center w-full max-w-[1200px] mx-auto">
        {sortedFavorites.map(film => (
          <FilmCard
            key={film.id}
            film={film}
            onClick={() => onFilmSelect(film)}
            onFavorite={() => removeFromFavorites(film.id)}
            isFavorite={true}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
