export interface Film {
  id: number;
  title: string;
  genre: string;
  year: number;
  rating: number;
  poster: string;
  description: string;
  director: string;
  cast: string[];
  duration: number;
  language?: string;
  country?: string;
  dateAdded?: string;
}
