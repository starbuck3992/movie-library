<template>
  <div v-if="movie" class="bg-white">
    <div class="mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <div>
        <router-link :to="{ name: ROUTES.MOVIE_LIST_PAGE }" class="mb-2 underline hover:text-blue-600">Back to
          home</router-link>
      </div>
      <div class="mt-2 lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
        <div class="lg:col-span-4 lg:row-end-1">
          <div class="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg bg-gray-100">
            <img :src="movie.poster" :alt="movie.title" class="object-center object-contain p-1 rounded-lg -m-1" />
          </div>
        </div>
        <div class="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-full">
          <div class="flex flex-col-reverse">
            <div class="mt-4">
              <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {{ movie.title }}
              </h1>
              <h2 id="information-heading" class="sr-only">Movie information</h2>
              <p class="font-bold text-base">Genre:</p>
              <div class="mt-2">
                <span v-for="(genre, index) in movie.genre" :key="index"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                  {{ genre }}
                </span>
              </div>
              <p class="font-bold text-base mt-2">Relase Date:</p>
              <div class="mt-2">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                  <time :datetime="movie.year">{{ movie.year }}</time>
                </span>
              </div>
              <p class="font-bold text-base mt-2">Director:</p>
              <div class="mt-2">
                <span v-for="(director, index) in (movie.director ? movie.director.split(', ') : [])" :key="index"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                  {{ director }}
                </span>
              </div>
              <p class="font-bold text-base mt-2">Actors:</p>
              <div class="mt-2">
                <span v-for="(actor, index) in (movie.actors ? movie.actors.split(', ') : [])" :key="index"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                  {{ actor }}
                </span>
              </div>
              <p class="font-bold text-base mt-2">Writer:</p>
              <div class="mt-2">
                <span v-for="(writer, index) in (movie.writer ? movie.writer.split(', ') : [])" :key="index"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                  {{ writer }}
                </span>
              </div>
              <p class="font-bold text-base mt-2">Plot:</p>
              <div class="mt-2 max-w-full break-all">{{ movie.plot }}</div>
            </div>
            <div>
              <h3 class="sr-only">Votes</h3>
              <p class="bold">Rating: {{ movie.imdbRating }}/10</p>
              <div class="mt-2 flex flex-col items-start">
                <p class="sr-only">{{ movie.rating }} out of 5 stars</p>
                <div class="flex items-center">
                  <StarIcon v-for="(rating, index) in [0, 1, 2, 3, 4]" :key="index"
                    @click="user.rateMovie(movie.imdbID, index + 1)" :class="[
                      movie.rating > rating ? 'text-yellow-400' : 'text-gray-200',
                      'h-5 w-5 flex-shrink-0 cursor-pointer z-10'
                    ]" aria-hidden="true" />
                </div>
                <p class="mt-1 text-sm text-gray-500">{{ movie.imdbRating }} Votes</p>
              </div>
            </div>
          </div>
        </div>
        <div class="mx-auto mt-16 w-full max-w-2xl lg:col-span-4 lg:mt-0 lg:max-w-none">
          <TabGroup as="div">
            <div class="border-b border-gray-200">
              <TabList class="-mb-px flex space-x-8">
                <Tab as="template" v-slot="{ selected }">
                  <button :class="[
                    selected
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800',
                    'whitespace-nowrap border-b-2 py-6 text-sm font-medium'
                  ]">
                    Reviews
                  </button>
                </Tab>
              </TabList>
            </div>
            <TabPanels as="template">
              <TabPanel class="-mb-10">
                <h3 class="sr-only">Reviews</h3>

                <div v-for="(review, reviewIdx) in movie.reviews" :key="reviewIdx"
                  class="flex space-x-4 text-sm text-gray-500">
                  <div :class="[reviewIdx === 0 ? '' : 'border-t border-gray-200', 'py-10']">
                    <h3 class="font-medium text-gray-900">
                      {{ review.name }}
                    </h3>
                    <p></p>

                    <p class="bold">Rating: {{ movie.rating }}/10</p>

                    <div class="prose prose-sm mt-4 max-w-none text-gray-500">
                      <p>{{ review.comment }}</p>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue';
import { StarIcon } from '@heroicons/vue/20/solid';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ROUTES } from '@/enums/RoutesEnum';
import { TOAST_SEVERITY } from '@/enums/ToastSeverityEnum';
import { IMovie } from '@/interfaces/IMovie';
import { useToastStore } from '@/stores/toast';
import { useUserStore } from '@/stores/user';

const props = defineProps({
  imdbID: {
    type: String,
    required: true
  }
});

const user = useUserStore();
const toast = useToastStore();
const router = useRouter();

const movie = ref<IMovie>();

onMounted(() => {
  getMovieById();
});

const getMovieById = () => {
  const localMovie = user.getMovie(props.imdbID);
  if (localMovie) {
    movie.value = localMovie;
  } else {
    toast.add(TOAST_SEVERITY.ERROR, 'Movie not found', '', 2000);
    router.push({ name: ROUTES.MOVIE_LIST_PAGE });
  }
};
</script>
<style scoped></style>
