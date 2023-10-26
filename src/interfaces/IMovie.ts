import { GENRE } from '@/enums/GenreEnum';

interface IRating {
  source: string;
  value: string;
}

export interface IMovie {
  imdbID: string;
  title: string;
  type: string;
  year: string;
  poster: string;
  ratings: IRating[];
  rating: number; // 0-5
  imdbRating: number; // 0-10
  reviews: { name: string; comment: string }[];
  reviewCount: number; // Number of reviews
  genre: GENRE[];
  releaseDate: string;
  runtime: string;
  director: string;
  writer: string;
  actors: string;
  plot: string;
  language: string;
  country: string;
  awards: string;
  boxOffice: string;
  production: string;
  website: string;
  response: string;
}
