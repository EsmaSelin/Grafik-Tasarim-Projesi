import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Film }   from '../types/Film';


interface FilmContextType {
  favorites: Film[];
  addToFavorites: (film: Film) => void;
  removeFromFavorites: (id: number) => void;
}

const FilmContext = createContext<FilmContextType | undefined>(undefined);

interface FilmProviderProps {
  children: ReactNode;
}

export const FilmProvider: React.FC<FilmProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Film[]>([]);

  const addToFavorites = (film: Film) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === film.id)) return prev;
      return [...prev, { ...film, dateAdded: new Date().toISOString() }];
    });
  };

  const removeFromFavorites = (id: number) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  return (
    <FilmContext.Provider value={{ favorites, addToFavorites, removeFromFavorites }}>
      {children}
    </FilmContext.Provider>
  );
};

export const useFilmContext = () => {
  const ctx = useContext(FilmContext);
  if (!ctx) throw new Error('useFilmContext must be used within a FilmProvider');
  return ctx;
};
