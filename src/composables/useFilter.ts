import { computed, Ref } from 'vue';
import { GENRE } from '@/enums/GenreEnum';
import { IMovie } from '@/interfaces/IMovie';

export const useFilter = (movies: Ref<IMovie[]>, selectedGenres: Ref<GENRE[]>) => {
  return computed(() => {
    if (selectedGenres.value.length > 0) {
      return movies.value.filter((movie) => {
        return movie.genre.some((genre) => selectedGenres.value.includes(genre));
      });
    } else {
      return movies.value;
    }
  });
};
