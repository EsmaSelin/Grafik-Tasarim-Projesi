// src/components/FilmCard.tsx
import React from 'react';
import type { Film } from '../types/Film';

interface FilmCardProps {
  film: Film;
  onClick?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

const FilmCard: React.FC<FilmCardProps> = ({ film, onClick, onFavorite, isFavorite }) => (
  <div className="w-[260px] bg-[#1f1f1f] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer p-4 relative">
    {/* Favori butonu */}
    {onFavorite && (
      <button
        onClick={e => { e.stopPropagation(); onFavorite(); }}
        className="absolute top-3 right-3 text-2xl"
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
    )}

    <div className="w-full h-[320px] overflow-hidden mb-4" onClick={onClick}>
      <img
        src={film.poster}
        alt={film.title}
        className="w-full h-full object-cover rounded-md"
      />
    </div>

    <div className="text-center" onClick={onClick}>
      <h3 className="text-white font-semibold text-lg mb-2">{film.title}</h3>
      <p className="text-gray-400 text-sm">{film.year}</p>
    </div>
  </div>
);

export default FilmCard;
