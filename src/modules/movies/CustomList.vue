<template>
  <div class="px-4 py-16 text-center sm:px-6 lg:px-8">
    <h1 class="text-4xl font-bold tracking-tight text-gray-900">{{ movieListName }}</h1>
  </div>
  <!-- Movie grid -->
  <Grid v-if="movies && movies.length > 0" :movies="movies"></Grid>

  <!-- Empty array -->
  <div v-else class="mt-6">
    <div class="flex flex-col items-center justify-center">
      <p class="text-2xl font-semibold text-gray-500">No movies in the list</p>
      <p class="text-sm text-gray-500">Add some movies to this list</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { IMovie } from '@/interfaces/IMovie';
import { IMovieList } from '@/interfaces/IMovieList';
import Grid from '@/modules/movies/components/Grid.vue';
import { useUserStore } from '@/stores/user';

const props = defineProps({
  movieListName: {
    type: String,
    required: true
  }
});

const user = useUserStore();

const movies = computed(() => {
  const list = user.getLists.find((list: IMovieList) => list.name === props.movieListName);
  if (!list) return [];
  return list.moviesIDs
    .map((imdbID: string) => user.getMovie(imdbID))
    .filter((movie: IMovie | undefined): movie is IMovie => movie !== undefined);
});
</script>
