import { useLocalStorage } from '@vueuse/core';

interface IuseRateMovie {
  (movieId: string, rating: number): void;
}

// Rate Movie
const useRateMovie: IuseRateMovie = (movieId, rating) => {
  const localMovieLibrary = useLocalStorage('moviesLibrary', {});
  localMovieLibrary.value = {
    ...localMovieLibrary.value,
    [movieId]: {
      ...localMovieLibrary.value[movieId],
      rating
    }
  };
};

export default useRateMovie;
