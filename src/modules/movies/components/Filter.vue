<template>
  <Disclosure
    as="section"
    aria-labelledby="filter-heading"
    class="grid items-center border-b border-gray-200 max-w-7xl mx-auto"
  >
    <h2 id="filter-heading" class="sr-only">Filters</h2>
    <div class="relative col-start-1 row-start-1 py-3">
      <div
        class="mx-auto flex max-w-7xl space-x-6 divide-x divide-gray-200 px-4 text-sm sm:px-6 lg:px-8"
      >
        <div>
          <DisclosureButton class="group flex items-center font-medium text-gray-700">
            <FunnelIcon
              class="mr-2 h-5 w-5 flex-none text-gray-400 group-hover:text-gray-500"
              aria-hidden="true"
            />
            1 Filter
          </DisclosureButton>
        </div>
        <div class="pl-6">
          <button
            @click="clearFilters"
            type="button"
            class="text-gray-500 hover:underline hover:text-blue-700"
          >
            Clear all
          </button>
        </div>
        <div class="mr-0 ml-auto block absolute right-0">
          <div class="mx-auto flex max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
            <label for="sort-by" class="pr-2">Sort by</label>
            <select
              @change="(e) => emit('update:sortBy', (e.target as HTMLSelectElement).value)"
              :value="props.sortBy"
              name="sort-by"
              id="sort-by"
            >
              <option v-for="field in sortByFields" :key="field.value" :value="field.value">
                {{ field.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <DisclosurePanel class="border-t border-gray-200 py-5">
      <div class="mx-auto w-full max-w-7xl">
        <fieldset>
          <legend class="block font-medium">Genre</legend>
          <div class="pt-6 flex w-full gap-x-2 align-baseline items-center my-auto">
            <div
              v-for="(genre, optionIdx) in filters.genre"
              :key="genre.value"
              class="text-base sm:text-sm flex items-center ml-2"
            >
              <input
                :id="`genre-${optionIdx}`"
                @input="toggleGenre(genre.value)"
                :checked="props.selectedGenres.includes(genre.value)"
                :value="props.selectedGenres"
                type="checkbox"
                class="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label :for="`genre-${optionIdx}`" class="ml-0.5 min-w-0 flex-1 text-gray-600">{{
                genre.label
              }}</label>
            </div>
          </div>
        </fieldset>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { FunnelIcon } from '@heroicons/vue/20/solid/index.js';
import { PropType, reactive } from 'vue';
import { GENRE } from '@/enums/GenreEnum';
import { SORT } from '@/enums/SortEnum';

const props = defineProps({
  sortBy: {
    type: String as PropType<SORT>,
    required: true,
    default: 'year'
  },
  selectedGenres: {
    type: Array as PropType<GENRE[]>,
    required: true,
    default: () => []
  }
});

const emit = defineEmits(['update:sortBy', 'update:selectedGenres']);

const filters = reactive({
  genre: [
    { value: GENRE.ACTION, label: 'Action' },
    { value: GENRE.COMEDY, label: 'Comedy' },
    { value: GENRE.DRAMA, label: 'Drama' }
  ],
});

const sortByFields = [
  { value: SORT.YEAR, label: 'By Year' },
  { value: SORT.RATING, label: 'Best Rating' },
  { value: SORT.TITLE, label: 'By Title' }
];

const toggleGenre = (genreValue: GENRE) => {
  const updatedGenres = [...props.selectedGenres]; // Create a copy of the selectedGenres array

  // Check if the genre is already in the array
  const index = updatedGenres.indexOf(genreValue);

  if (index !== -1) {
    // Genre is already in the array, so remove it
    updatedGenres.splice(index, 1);
  } else {
    // Genre is not in the array, so add it
    updatedGenres.push(genreValue);
  }

  emit('update:selectedGenres', updatedGenres); // Emit the updated array
};

const clearFilters = () => {
  emit('update:sortBy', 'year');
  emit('update:selectedGenres', []);
};
</script>
