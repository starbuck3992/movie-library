<template>
  <Loading v-if="isLoading"></Loading>
  <main class="">
    <div class="px-4 py-16 text-center sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold tracking-tight text-gray-900">Rated movies</h1>
    </div>

    <!-- Filters -->
    <Filter v-if='ratedMovies.length > 0' v-model:selectedGenres="selectedGenres" v-model:sortBy="sortBy"></Filter>
    <!-- Movie grid -->
    <Grid v-if="ratedMovies.length > 0" :movies="sortedMovies"></Grid>

    <!-- Empty array -->
    <div v-if="(!ratedMovies.length || !sortedMovies.length) && !isLoading" class="mt-6">
      <div class="flex flex-col items-center justify-center">
        <p class="text-2xl font-semibold text-gray-500">No rated movies found</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="sortedMovies.length" class="mb-10">
      <Pagination
        :currentPage="currentPage"
        :recordsPerPage="recordsPerPage"
        :totalRecordsCount="totalRecordsCount"
        @selectPage="changePage"
      ></Pagination>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useFilter } from '@/composables/useFilter';
import { useSort } from '@/composables/useSort';
import { GENRE } from '@/enums/GenreEnum';
import { SORT } from '@/enums/SortEnum';
import { IMovie } from '@/interfaces/IMovie';
import Loading from '@/modules/Loading.vue';
import Filter from '@/modules/movies/components/Filter.vue';
import Grid from '@/modules/movies/components/Grid.vue';
import Pagination from '@/modules/movies/components/Pagination.vue';
import { useUserStore } from '@/stores/user';

const user = useUserStore();

const allRatedMovies = ref<IMovie[]>([]);
const ratedMovies = ref<IMovie[]>([]);

const selectedGenres = ref<GENRE[]>([]);
const sortBy = ref<SORT>(SORT.YEAR);

const currentPage = ref(1);
const totalRecordsCount = ref(0);
const recordsPerPage = 10;

const isLoading = ref(false);

const filteredMovies = useFilter(ratedMovies, selectedGenres);
const sortedMovies = useSort(filteredMovies, sortBy);

onMounted(async () => {
  // Get rated movies
  await getRatedMovies();
});

const getRatedMovies = async () => {
  // Get all movies that user has rated or reviewed
  allRatedMovies.value = user.movies.filter(
    (movie) => movie.rating > 0 || movie.reviews.length > 0);

  // Calculate total records count
  totalRecordsCount.value = allRatedMovies.value.length;

  // Get movies for the current page
  ratedMovies.value = allRatedMovies.value.slice(
    (currentPage.value - 1) * recordsPerPage, currentPage.value * recordsPerPage);
};

const changePage = async (page: number) => {
  isLoading.value = true;
  currentPage.value = page;

  // Get movies for the current page
  ratedMovies.value = allRatedMovies.value.slice(
    (page - 1) * recordsPerPage, page * recordsPerPage);

  isLoading.value = false;
};
</script>
