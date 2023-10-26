<template>
  <nav
    aria-label="Pagination"
    class="mx-auto mt-6 flex max-w-7xl justify-between px-4 text-sm font-medium text-gray-700 sm:px-6 lg:px-8"
  >
    <div class="min-w-0 flex-1">
      <button
        v-show="currentPage !== 1"
        @click="selectPage(currentPage - 1)"
        class="[ isPaginationDisabled ? 'cursor-wait': 'cursor-pointer', 'inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100 focus:border-indigo-600', 'focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-indigo-600']"
      >
        Previous
      </button>
    </div>
    <div class="hidden space-x-2 sm:flex">
      <button
        v-show="isFirstPageVisible"
        @click="selectPage(1)"
        class="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-indigo-600"
      >
        {{ firstPage }}
      </button>
      <span
        v-show="isFirstDotsVisible"
        class="inline-flex h-10 items-center px-1.5 text-gray-500"
        >{{ firstDots }}</span
      >
      <button
        v-show="isPreviousPageVisible"
        @click="selectPage(currentPage - 1)"
        class="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-indigo-600"
      >
        {{ previousPage }}
      </button>
      <button
        disabled
        class="inline-flex h-10 items-center rounded-md border border-indigo-600 bg-white px-4 ring-1 ring-indigo-600 hover:bg-gray-100 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-indigo-600"
      >
        {{ currentPage }}
      </button>
      <button
        v-show="isNextPageVisible"
        @click="selectPage(nextPage)"
        class="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100 focus:border-indigo-600 'focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-indigo-600"
      >
        {{ nextPage }}
      </button>
      <span v-show="isLastDotsVisible" class="inline-flex h-10 items-center px-1.5 text-gray-500">{{
        lastDots
      }}</span>
      <button
        v-show="isLastPageVisible"
        @click="selectPage(totalPages)"
        class="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-indigo-600"
      >
        {{ totalPages }}
      </button>
    </div>
    <div class="flex min-w-0 flex-1 justify-end">
      <button
        v-show="currentPage !== totalPages"
        @click="selectPage(currentPage + 1)"
        class="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-indigo-600"
      >
        Next
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';

const props = defineProps({
  totalRecordsCount: {
    type: Number,
    required: true
  },
  recordsPerPage: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['selectPage']);

const firstPage = 1;

const user = useUserStore();

const isFirstPageVisible = computed<boolean>(() => {
  return props.currentPage > 2;
});

const firstDots = computed(() => {
  if (props.currentPage > 3) {
    return '...';
  } else {
    return 2;
  }
});

const isFirstDotsVisible = computed<boolean>(() => {
  return previousPage.value > 2;
});

const previousPage = computed<number>(() => {
  if (props.currentPage === 1) {
    return 1;
  }
  return props.currentPage - 1;
});

const isPreviousPageVisible = computed<boolean>(() => {
  return props.currentPage > 1 && totalPages.value > 1;
});

const nextPage = computed<number>(() => {
  return props.currentPage + 1;
});

const isNextPageVisible = computed<boolean>(() => {
  return props.currentPage < totalPages.value;
});

const lastDots = computed(() => {
  if (props.currentPage < totalPages.value - 2) {
    return '...';
  } else {
    return totalPages.value - 1;
  }
});

const isLastDotsVisible = computed<boolean>(() => {
  return props.currentPage < totalPages.value - 2;
});

const isLastPageVisible = computed<boolean>(() => {
  return props.currentPage < totalPages.value - 1;
});

const totalPages = computed<number>(() => {
  return Math.ceil(props.totalRecordsCount / props.recordsPerPage);
});

const selectPage = (page: number) => {
  emit('selectPage', page);
};
</script>
