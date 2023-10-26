<template>
  <div class="mt-2 flex items-end align-bottom w-fit gap-3 mx-auto">
    <div>
      <label for="search">Title</label>
      <input
        v-model="queryParameters.s"
        type="text"
        @keyup.enter="search"
        name="search"
        id="search"
        placeholder="You must fill in the field"
        required
        :class="[
          isQueryValid ? 'ring-green-500 ring-1' : 'ring-red-700 ring-1',
          'block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
        ]"
      />
    </div>
    <div>
      <label for="year">Year</label>
      <input
        name="year"
        id="year"
        type="text"
        v-model="queryParameters.y"
        @keyup.enter="search"
        placeholder="YYYY"
        :class="[
          queryParameters.y ? 'ring-green-500 ring-1' : '',
          'pr-2 block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
        ]"
      />
    </div>
    <button
      @click="search"
      :disabled="!isQueryValid"
      class="block w-auto rounded-md bg-indigo-600 px-2.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      type="button"
    >
      Search
    </button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

const user = useUserStore();

const {queryParameters} = storeToRefs(user);

const minReleaseYear = 1878;
const maxReleaseYear = new Date().getFullYear();

const emit = defineEmits(['search']);

onMounted(() => {
  search();
});

const isQueryValid = computed(() => {
  if (!queryParameters.value.y && queryParameters.value.s !== '') {
    return true;
  }
  if (parseInt(queryParameters.value.y) < minReleaseYear || parseInt(queryParameters.value.y) > maxReleaseYear) {
    return false;
  }
  return !(queryParameters.value.s === '' || isNaN(parseInt(queryParameters.value.y)));
});

const search = (e?: Event) => {
  if (isQueryValid.value) {
    // Set page to 1 if the user is searching
    if (e) {
      queryParameters.value.page = 1;
    }

    // Set last search query
    user.setLastSearchQueryParameters(queryParameters.value);

    emit('search', user.getQueryParameters);
  }
};
</script>
