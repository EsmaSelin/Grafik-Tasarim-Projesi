export interface FilmNote {
  id: string;
  filmTitle: string;
  filmId: number;
  note: string;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  tags: string[];
}
