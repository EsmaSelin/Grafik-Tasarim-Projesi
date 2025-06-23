// src/App.tsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import FavoritesPage from "./pages/FavoritesPage";
import NotesPage from "./pages/NotesPage";
import FilmDetailModal from "./components/FilmDetailModal";

import { FilmProvider, useFilmContext } from "./context/FilmContext";
import type { Film } from "./types/Film";
import type { FilmNote } from "./types/FilmNote";

function AppRoutes() {
  // 1️⃣ Context’ten favoriler ve favori ekleme/çıkarma metodları
  const { favorites, addToFavorites, removeFromFavorites } = useFilmContext();

  // 2️⃣ Notlar (localStorage)
  const [notes, setNotes] = useState<FilmNote[]>(() => {
    const saved = localStorage.getItem("filmbox_notes");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem("filmbox_notes", JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = (
    note: Omit<FilmNote, "id" | "createdAt" | "updatedAt">
  ) => {
    const newNote: FilmNote = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [...prev, newNote]);
  };
  const handleUpdateNote = (id: string, updated: Partial<FilmNote>) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, ...updated, updatedAt: new Date().toISOString() } : n
      )
    );
  };
  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // 3️⃣ Seçilen filmi modal’da göstermek için state
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleFilmSelect = (film: Film) => {
    setSelectedFilm(film);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFilm(null);
  };
  const isFavorite = (film: Film) =>
    favorites.some((f) => f.id === film.id);

  // 4️⃣ Modal’dan gelen film objesini “note” formatına çeviren helper
  const handleAddNoteFromModal = (film: Film) => {
    handleCloseModal();
    handleAddNote({
      filmTitle: film.title,
      filmId: film.id,
      note: "",
      rating: film.rating,
      tags: [],
    });
  };

  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<HomePage onFilmSelect={handleFilmSelect} />}
        />
        <Route
          path="/search"
          element={<SearchPage onFilmSelect={handleFilmSelect} />}
        />
        <Route
          path="/favorites"
          element={
            // artık FAVORITES için sadece onFilmSelect
            <FavoritesPage onFilmSelect={handleFilmSelect} />
          }
        />
        <Route
          path="/notes"
          element={
            <NotesPage
              notes={notes}
              onAddNote={handleAddNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
            />
          }
        />
      </Routes>

      {/* Film detay modalı */}
      <FilmDetailModal
        film={selectedFilm}
        open={modalOpen}
        onClose={handleCloseModal}
        onAddToFavorites={addToFavorites}
        onRemoveFromFavorites={removeFromFavorites}
        isFavorite={selectedFilm ? isFavorite(selectedFilm) : false}
        onAddNote={handleAddNoteFromModal}
      />
    </>
  );
}

const App: React.FC = () => (
  <FilmProvider>
    <Router>
      <AppRoutes />
    </Router>
  </FilmProvider>
);

export default App;
