<template>
  <Loading v-if="isLoading"></Loading>
  <main class="">
    <div class="px-4 py-16 text-center sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold tracking-tight text-gray-900">Movies</h1>
    </div>

    <!-- Search -->
    <div class="px-4 sm:px-6 lg:px-8 mb-8 border-b border-gray-200">
      <div class="py-4">
        <div class="max-w-xl mx-auto">
          <SearchInput @search="searchMovie" />
        </div>
      </div>
    </div>

    <!-- Filters -->
    <Filter
      v-if="movies.length > 0"
      v-model:selectedGenres="selectedGenres"
      v-model:sortBy="sortBy"
    ></Filter>

    <!-- Movie grid -->
    <Grid v-if="movies.length > 0" :movies="sortedMovies"></Grid>
    <!-- No results -->
    <div v-if="(!movies.length || !sortedMovies.length) && !isLoading" class="mt-6">
      <div class="flex flex-col items-center justify-center">
        <p class="text-2xl font-semibold text-gray-500">No results found</p>
        <p class="text-sm text-gray-500">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="sortedMovies.length" class="mb-10">
      <Pagination
        :currentPage="user.getQueryParameters.page"
        :recordsPerPage="recordsPerPage"
        :totalRecordsCount="totalRecordsCount"
        @selectPage="changePage"
      ></Pagination>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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
import SearchInput from '@/modules/movies/components/Search.vue';
import api, { apiSearchMovieRequest } from '@/services/api';
import { useToastStore } from '@/stores/toast';
import { useUserStore } from '@/stores/user';

const user = useUserStore();
const toast = useToastStore();

const movies = ref<IMovie[]>([]);

const selectedGenres = ref<GENRE[]>([]);
const sortBy = ref<SORT>(SORT.YEAR);

const totalRecordsCount = ref(0);
const recordsPerPage = 10;

const isLoading = ref<boolean>(false);

const filteredMovies = useFilter(movies, selectedGenres);
const sortedMovies = useSort(filteredMovies, sortBy);

// Search movies
const searchMovie = async (searchParameters: apiSearchMovieRequest) => {
  isLoading.value = true;

  // Reset movies
  movies.value = [];

  try {
    const searchMovieResponse = await api.searchMovie(searchParameters);

    if (searchMovieResponse.Response === 'False') {
      handleError(searchMovieResponse.Error);
      movies.value = [];
      return;
    }

    const moviesIds = searchMovieResponse.Search.map((movie) => movie.imdbID);

    // Get movies from local storage
    const localMovies = user.movies.filter((movie) => moviesIds.includes(movie.imdbID));

    // Add movies from local storage
    movies.value.push(...localMovies);

    // Get remaining movies from API
    const moviesIdsToFetch = moviesIds.filter(
      (id: string) => !localMovies.some((movie) => movie.imdbID === id)
    );

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
        // Get movie details from API
        const movie = result.value as IMovie;

        // Add movie to local storage
        user.addMovie(movie);

        // Add movie to movies array
        movies.value.push(movie);
      }
    });

    const parsedTotalResults = Number(searchMovieResponse.totalResults);

    totalRecordsCount.value = isNaN(parsedTotalResults) ? 0 : parsedTotalResults;
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

const handleError = (error: any) => {
  let toastMessage;

  if (error.response) {
    toastMessage = error.response.data.Error;
  } else if (error.request) {
    toastMessage = error.request;
  } else {
    toastMessage = error;
  }
  toast.add(TOAST_SEVERITY.ERROR, 'Error', toastMessage, 3000);
};

const changePage = async (page: number) => {
  let updatedParameters;

  // Check if query parameters 's' or 'y' have changed compared to the last search
  if (user.getQueryParameters.s !== user.getLastSearchQueryParameters.s
    || user.getQueryParameters.y !== user.getLastSearchQueryParameters.y) {
    updatedParameters = user.getLastSearchQueryParameters;
  } else {
    updatedParameters = user.getQueryParameters;
  }
  
  // Update only the page parameter
  user.setQueryParameters({
    ...updatedParameters,
    page
  });

  // Search movies
  await searchMovie(user.getQueryParameters);
};
</script>
