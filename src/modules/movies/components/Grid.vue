<template>
  <section aria-labelledby="movies-heading" class="mx-auto max-w-7xl">
    <div class="grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
      <div v-for="movie in movies" :key="movie.imdbID"
           class="border-b border-r border-gray-200 p-4 sm:p-6 h-[650px] sm:h-[700px] relative">
        <div class="w-full flex justify-between">
          <AddMovieToCustomList :movieImdbID="movie.imdbID"></AddMovieToCustomList>
          <button v-show="isMovieInList(movie.imdbID)" @click="removeFromMovieLists(movie.imdbID)" class="text-right">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div class="overflow-hidden rounded-lg bg-gray-200 flex align-baseline">
          <img :src="movie.poster" :alt="movie.title"
               class="w-full h-[250px] sm:h-[300px] object-cover object-center" />
        </div>
        <div class="pb-4 pt-10 text-center">
          <h3 class="text-sm sm:text-base text-gray-900">
            <span class="font-bold">{{ truncateTitle(movie.title) }}</span>
          </h3>
          <p class="text-xs sm:text-sm mt-2">Released: {{ movie.year }}</p>
          <p class="text-xs sm:text-sm mt-2">
              <span v-for="(genre, index) in movie.genre" :key="index">
                {{ genre }}<span v-if="index + 1 < movie.genre.length">, </span>
              </span>
          </p>
          <div class="mt-2 flex flex-col items-center">
            <p class="text-black text-sm">IMDB rating: {{ movie.imdbRating }}/10</p>
            <p class="mt-1 text-sm text-gray-500">Votes: {{ movie.reviewCount }}</p>
            <p class="text-black text-sm mt-2 font-medium">Your rating</p>
            <p class="sr-only">{{ movie.rating }} out of 5 stars</p>
            <div class="flex items-center">
              <StarIcon v-for="(rating, index) in [0, 1, 2, 3, 4]" :key="index"
                        @click="user.rateMovie(movie.imdbID, index + 1)" @mouseover="hoverIndices[movie.imdbID] = index"
                        @mouseout="hoverIndices[movie.imdbID] = -1" :class="[
                    index <= hoverIndices[movie.imdbID] || movie.rating > rating
                      ? 'text-yellow-400'
                      : 'text-gray-200',
                    'h-5 w-5 flex-shrink-0 cursor-pointer z-10'
                  ]" aria-hidden="true" />
            </div>
            <div class="relative mt-4 flex items-center">
              <p @click="openWriteReviewModal(movie.imdbID)"
                 class="text-black hover:underline hover:text-indigo-500 cursor-pointer">
                Write review
              </p>
              <PlusCircleIcon class="w-4 h-4 ml-1 animate-pulse text-orange-400"></PlusCircleIcon>
            </div>
          </div>
          <router-link :to="{
              name: ROUTES.MOVIE_DETAIL_PAGE,
              params: { imdbID: movie.imdbID }
            }"
                       class="block mx-auto absolute bottom-2 w-fit mb-0 left-1/2 -translate-x-1/2 rounded-md bg-indigo-600 px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Show More
          </router-link>
        </div>
      </div>
    </div>
  </section>
  <!-- Modals -->
  <AddReview v-model:is-open="openReviewsModal" :imdbID="movieIdToReview"></AddReview>
</template>

<script setup lang='ts'>
import { PlusCircleIcon, StarIcon } from '@heroicons/vue/20/solid';
import { PropType, ref } from 'vue';
import { ROUTES } from '@/enums/RoutesEnum';
import { TOAST_SEVERITY } from '@/enums/ToastSeverityEnum';
import { IMovie } from '@/interfaces/IMovie';
import AddReview from '@/modules/movies/components/AddReview.vue';
import AddMovieToCustomList from '@/modules/movies/components/AddToCustomList.vue';
import { useToastStore } from '@/stores/toast';
import { useUserStore } from '@/stores/user';

defineProps(
  {
    movies: {
      type: Array as PropType<IMovie[]>,
      required: true
    }
});

const user = useUserStore();
const toast = useToastStore();

const openReviewsModal = ref(false);
const movieIdToReview = ref('');

const hoverIndices = ref({});

const openWriteReviewModal = (imdbId: string) => {
  movieIdToReview.value = imdbId;
  openReviewsModal.value = true;
};

const isMovieInList = (imdbID: string) => {
  if(user.getLists.length === 0) return false;
  return user.getLists.some(
    (list) => list.moviesIDs?.some((movie) => movie === imdbID
    ));
};

const removeFromMovieLists = (imdbID: string) => {
  user.removeFromList(imdbID);
  toast.add(TOAST_SEVERITY.SUCCESS, 'Movie removed from lists', '', 2000);
};

const truncateTitle = (title: string, maxLength = 50) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
};
</script>
