import { useLocalStorage } from '@vueuse/core';

interface IuseReviewMovie {
  (movieId: string, name: string, comment: string, rating: number): void;
}

// Rate Movie
const useReviewMovie: IuseReviewMovie = (
  movieId,
  name: string,
  comment: string,
  rating: number
) => {
  const localMovieLibrary = useLocalStorage('moviesLibrary', {});

  // Check if the movie exists in the library
  const existingMovie = localMovieLibrary.value[movieId];

  // If it doesn't exist, create a new movie with the review
  if (!existingMovie) {
    localMovieLibrary.value = {
      ...localMovieLibrary.value,
      [movieId]: {
        rating: rating,
        reviews: [{ name, comment }]
      }
    };
    return;
  }

  // Update the movie's review array, or add the new movie with its first review
  localMovieLibrary.value = {
    ...localMovieLibrary.value,
    [movieId]: {
      rating: rating,
      reviews: [...existingMovie.reviews, { name, comment }]
    }
  };
};

export default useReviewMovie;
