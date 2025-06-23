import React from 'react';
import FilmCard from '../components/FilmCard';
import type { Film } from '../types/Film';
import { films } from '../data/films';
import { useFilmContext } from '../context/FilmContext';

interface HomePageProps {
  onFilmSelect: (film: Film) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onFilmSelect }) => {
  const { favorites, addToFavorites, removeFromFavorites } = useFilmContext();

  return (
    <div className="homepage px-4 py-10 mx-auto max-w-7xl space-y-6">
      <h1 className="text-4xl font-bold text-white mb-2 text-center">
        FilmBox
      </h1>
      <p className="text-lg text-gray-300 text-center mb-10">
        Binlerce filmi keşfet, favorilerini kaydet ve sinema deneyimini paylaş!
      </p>
      <h2 className="text-2xl font-semibold text-white mb-6">
        Popüler Filmler
      </h2>

      <div className="grid grid-cols-3 gap-8 place-items-center w-full max-w-[1200px] mx-auto">
        {films.map(film => {
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
    </div>
  );
};

export default HomePage;
