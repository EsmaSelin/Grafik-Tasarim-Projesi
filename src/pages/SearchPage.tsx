// src/pages/SearchPage.tsx
import React, { useState, useEffect } from 'react';
import type { Film } from '../types/Film';
import { films } from '../data/films';
import FilmCard from '../components/FilmCard';
import { useFilmContext } from '../context/FilmContext';
import './SearchPage.css';

interface SearchPageProps {
  onFilmSelect: (film: Film) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onFilmSelect }) => {
  const { favorites, addToFavorites, removeFromFavorites } = useFilmContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFilms, setFilteredFilms] = useState<Film[]>(films);
  const [genreFilter, setGenreFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  useEffect(() => {
    let result = films.filter(film =>
      film.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (genreFilter) {
      result = result.filter(
        film => film.genre.toLowerCase() === genreFilter.toLowerCase()
      );
    }

    if (yearFilter) {
      result = result.filter(
        film => film.year.toString().includes(yearFilter)
      );
    }

    if (ratingFilter) {
      result = result.filter(
        film => film.rating >= parseFloat(ratingFilter)
      );
    }

    setFilteredFilms(result);
  }, [searchQuery, genreFilter, yearFilter, ratingFilter]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 mx-auto max-w-7xl space-y-10">
      {/* 1️⃣ Arama + Filtreler */}
      <div className="search-controls">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Film adıyla ara..."
        />

        <select
          value={genreFilter}
          onChange={e => setGenreFilter(e.target.value)}
        >
          <option value="">Tür</option>
          <option value="Drama">Drama</option>
          <option value="Crime">Crime</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Action">Action</option>
        </select>

        <input
          type="number"
          value={yearFilter}
          onChange={e => setYearFilter(e.target.value)}
          placeholder="Yıl gir…"
        />

        <select
          value={ratingFilter}
          onChange={e => setRatingFilter(e.target.value)}
        >
          <option value="">Puan</option>
          <option value="9">9+</option>
          <option value="8">8+</option>
        </select>
      </div>

      {/* 2️⃣ Film Kartları Grid */}
      <div className="grid grid-cols-3 gap-10 place-items-center w-full max-w-[1200px] mx-auto">
        {filteredFilms.map(film => {
          const isFav = favorites.some(f => f.id === film.id);
          return (
            <FilmCard
              key={film.id}
              film={film}
              onClick={() => onFilmSelect(film)}
              onFavorite={() =>
                isFav ? removeFromFavorites(film.id) : addToFavorites(film)
              }
              isFavorite={isFav}
            />
          );
        })}
      </div>

      {/* 3️⃣ Film bulunamazsa */}
      {filteredFilms.length === 0 && (
        <p className="text-center text-gray-400 mt-20">
          Aradığın film bulunamadı.
        </p>
      )}
    </div>
  );
};

export default SearchPage;
