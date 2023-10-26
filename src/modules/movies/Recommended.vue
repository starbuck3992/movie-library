<template>
  <Loading v-if="isLoading"></Loading>
  <main class="">
    <div class="px-4 py-16 text-center sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold tracking-tight text-gray-900">Recommended movies</h1>
    </div>

    <!-- Filters -->
    <Filter v-if='movies.length > 0' v-model:selectedGenres="selectedGenres" v-model:sortBy="sortBy"></Filter>
    <!-- Movie grid -->
    <Grid v-if="movies.length > 0" :movies="sortedMovies"></Grid>

    <!-- Empty array -->
    <div v-if="(!movies.length || !sortedMovies.length) && !isLoading" class="mt-6">
      <div class="flex flex-col items-center justify-center">
        <p class="text-2xl font-semibold text-gray-500">No movies found</p>
        <p class="text-sm text-gray-500">Review some movies to get recommendations</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="sortedMovies.length" class="mb-10">
      <Pagination
        :currentPage="queryParameters.page"
        :recordsPerPage="recordsPerPage"
        :totalRecordsCount="totalRecordsCount"
        @selectPage="changePage"
      ></Pagination>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useFilter } from '@/composables/useFilter';
import { useMapMovieDetail } from '@/composables/useMapMovieDetail';
import { useSort } from '@/composables/useSort';
import { GENRE } from '@/enums/GenreEnum';
import { SORT } from '@/enums/SortEnum';
import { TOAST_SEVERITY } from '@/enums/ToastSeverityEnum';
import { IMovie } from '@/interfaces/IMovie';
import Loading from '@/modules/Loading.vue';
import Filter from '@/modules/movies/components/Filter.vue';
import Grid from '@/modules/movies/components/Grid.vue';
import Pagination from '@/modules/movies/components/Pagination.vue';
import api, { apiSearchMovieRequest } from '@/services/api';
import { useToastStore } from '@/stores/toast';
import { useUserStore } from '@/stores/user';

const user = useUserStore();
const toast = useToastStore();

const queryParameters = reactive<apiSearchMovieRequest>({
  s: '',
  type: '',
  y: '',
  page: 1 // Search from the first page
});

const movies = ref<IMovie[]>([]);
const alreadyRatedMovies = ref<IMovie[]>([]);

const selectedGenres = ref<GENRE[]>([]);
const sortBy = ref<SORT>(SORT.YEAR);

const totalRecordsCount = ref(0);
const recordsPerPage = 10;

const isLoading = ref(true);

const filteredMovies = useFilter(movies, selectedGenres);
const sortedMovies = useSort(filteredMovies, sortBy);

onMounted(async () => {
  // Set query parameters
  await setQueryString();

  if (!queryParameters.s) {
    isLoading.value = false;
    return;
  }

  // Search movies
  await getRecommendedMovies();
});

const setQueryString = async () => {
  // Get all movies that user has rated
  const ratedMovies = user.movies.filter((movie) => movie.rating > 0);

  if (!ratedMovies.length) {
    return;
  }

  // Set already rated movies
  alreadyRatedMovies.value = ratedMovies;

  // Get random movie from rated movies
  const randomMovie = ratedMovies[Math.floor(Math.random() * ratedMovies.length)];

  // Get random 4 letter+ word from movie title
  const randomWord = randomMovie.title
    .split(' ')
    .filter((word) => word.length > 3)
    .sort(() => Math.random() - Math.random())
    .slice(0, 1);

  // If no word is found, set current month as query parameter
  if (!randomWord.length) {
    const date = new Date();
    queryParameters.s = date.toLocaleString('en-US', { month: 'long' });
    return;
  }

  queryParameters.s = randomWord[0];
};

const getRecommendedMovies = async () => {
  // Reset movies
  movies.value = [];

  try {
    // Search movies
    const searchMovieResponse = await api.searchMovie(queryParameters);

    if (searchMovieResponse.Response === 'False') {
      handleError(searchMovieResponse.Error);
      movies.value = [];
      return;
    }

    // Get only ids
    const moviesIds = searchMovieResponse.Search.map((movie) => movie.imdbID);

    // Remove movies that user has already rated
    const moviesIdsNotRated = moviesIds.filter(
      (id: string) => !alreadyRatedMovies.value.some((movie) => movie.imdbID === id)
    );

    // Get movies from local storage
    const localMovies = user.movies.filter((movie) => moviesIdsNotRated.includes(movie.imdbID));

    // Add movies from local storage
    movies.value.push(...localMovies);

    // Get remaining movies from API
    const moviesIdsToFetch = moviesIds.filter(
      (id: string) => !localMovies.some((movie) => movie.imdbID === id)
    );

    // Get movie details from API
    const moviesResponse = await Promise.allSettled(
      moviesIdsToFetch.map(async (id: string) => {
        // Get movie details by ID
        const movieResponse = await api.getMovieById({
          i: id,
          plot: 'full'
        });
        if (movieResponse.Response === 'False') {
          return;
        }

        return useMapMovieDetail(movieResponse);
      })
    );

    moviesResponse.forEach((result) => {
      if (result.status === 'fulfilled') {

        // Add movie to local storage
        user.addMovie(result.value as IMovie);

        // Add movie to movies array
        movies.value.push(result.value as IMovie);
      }
    });

    const parsedTotalResults = Number(searchMovieResponse.totalResults);

    totalRecordsCount.value = isNaN(parsedTotalResults) ? 0 : parsedTotalResults;
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
};

const handleError = (error: any) => {
  let toastMessage;

  if (error.response) {
    toastMessage = error.response.data.Error;
  } else if (error.request) {
    toastMessage = error.request;
  } else {
    toastMessage = error;
  }
  toast.add(TOAST_SEVERITY.ERROR, toastMessage, '', 3000);
};

const changePage = async (page: number) => {
  isLoading.value = true;
  // Set page query parameter
  queryParameters.page = page;
  // Get recommended movies
  await getRecommendedMovies();
};
</script>
