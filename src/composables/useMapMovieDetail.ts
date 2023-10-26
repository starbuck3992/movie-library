import { GENRE } from '@/enums/GenreEnum';
import { IMovie } from '@/interfaces/IMovie';
import { apiGetMovieResponse } from '@/services/api';

export const useMapMovieDetail = (movie: apiGetMovieResponse): IMovie => {
  return {
    imdbID: movie.imdbID,
    title: movie.Title,
    type: movie.Type,
    year: movie.Year,
    poster: movie.Poster === 'N/A' ? '/images/placeholder.svg' : movie.Poster, // Add placeholder image if no poster is available
    ratings: movie.Ratings.map((rating) => {
      return {
        source: rating.Source,
        value: rating.Value
      };
    }),
    rating: 0, // Default rating
    imdbRating: parseFloat(movie.imdbRating),
    reviews: [],
    reviewCount: 0,
    genre: movie.Genre.split(', ') as GENRE[], // Split the string into array
    releaseDate: movie.Released,
    runtime: movie.Runtime,
    director: movie.Director,
    writer: movie.Writer,
    actors: movie.Actors,
    plot: movie.Plot,
    language: movie.Language,
    country: movie.Country,
    awards: movie.Awards,
    boxOffice: movie.BoxOffice,
    production: movie.Production,
    website: movie.Website,
    response: movie.Response
  };
};
