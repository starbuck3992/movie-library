import { computed, Ref } from 'vue';
import { SORT } from '@/enums/SortEnum';
import { IMovie } from '@/interfaces/IMovie';

export const useSort = (movies: Ref<IMovie[]>, sortBy: Ref<SORT>) => {
  return computed<IMovie[]>(() => {
    const sortedMovies = [...movies.value]; // Create a shallow copy of the original array

    if (sortBy.value) {
      switch (sortBy.value) {
        case SORT.YEAR:
          sortedMovies.sort((a, b) => parseInt(b.year) - parseInt(a.year));
          break;
        case SORT.RATING:
          sortedMovies.sort((a, b) => b.rating - a.rating);
          break;
        default:
          sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
          break;
      }
    }

    return sortedMovies;
  });
};
