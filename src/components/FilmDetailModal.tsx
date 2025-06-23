// src/components/FilmDetailModal.tsx
import React from "react";
import type { Film } from "../types/Film";

interface Props {
  film: Film | null;
  open: boolean;
  onClose: () => void;
  onAddToFavorites: (film: Film) => void;
  onRemoveFromFavorites: (id: number) => void;
  isFavorite: boolean;
  onAddNote: (film: Film) => void;
}

const FilmDetailModal: React.FC<Props> = ({
  film,
  open,
  onClose,
  onAddToFavorites,
  onRemoveFromFavorites,
  isFavorite,
  onAddNote,
}) => {
  if (!open || !film) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-zinc-900 text-white rounded-lg w-full max-w-3xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold"
        >
          &times;
        </button>

        <div className="flex gap-6 mb-4">
          <img
            src={film.poster}
            alt={film.title}
            className="w-48 rounded shadow"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{film.title}</h2>
            <p className="text-sm text-gray-400">
              {film.year} | {film.genre}
            </p>
            <p className="text-yellow-400 mb-2">⭐ {film.rating}</p>
            <p className="text-sm">{film.description}</p>
          </div>
        </div>

        <div className="flex space-x-4">
          {isFavorite ? (
            <button
              onClick={() => onRemoveFromFavorites(film.id)}
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
            >
              💔 Remove Favorite
            </button>
          ) : (
            <button
              onClick={() => onAddToFavorites(film)}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition"
            >
              ❤️ Add to Favorites
            </button>
          )}
          <button
            onClick={() => onAddNote(film)}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            📝 Add Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilmDetailModal;
