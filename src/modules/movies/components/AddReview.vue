<template>
  <TransitionRoot as="template" :show="innerIsOpen">
    <Dialog as="div" class="relative z-10" @close="innerIsOpen = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <form @submit.prevent="onSubmit()" class="w-full mt-2">
                <div class="">
                  <div class="mt-3 text-center sm:mt-0 sm:text-left">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900"
                      >Comment review</DialogTitle
                    >
                    <div class="flex mt-2">
                      <StarIcon
                        v-for="(rating, index) in [0, 1, 2, 3, 4]"
                        :key="index"
                        @click="setRating(rating)"
                        @mouseover="hoverIndex = index"
                        @mouseout="hoverIndex = -1"
                        :class="[
                          index <= hoverIndex || index <= currentRating - 1
                            ? 'text-yellow-400'
                            : 'text-gray-200',
                          'h-5 w-5 flex-shrink-0 cursor-pointer z-10'
                        ]"
                        aria-hidden="true"
                      />
                    </div>
                    <div class="w-full mt-2">
                      <label for="name" class="block text-sm font-medium leading-6 text-gray-900"
                        >Name</label
                      >
                      <div class="mt-2">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          v-model="name"
                          :class="[
                            name ? 'ring-green-500 ring-1' : 'ring-red-700 ring-1',
                            'block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                          ]"
                          placeholder="enter name"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        for="comment"
                        class="block text-sm font-medium leading-6 text-gray-900 mt-2"
                        >Add your comment</label
                      >
                      <div class="mt-2">
                        <textarea
                          rows="4"
                          name="comment"
                          id="comment"
                          v-model="comment"
                          :class="[
                            comment ? 'ring-green-500 ring-1' : 'ring-red-700 ring-1',
                            'block w-full rounded-md border-0 pl-2 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                          ]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    @click="closeModal()"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { StarIcon } from '@heroicons/vue/20/solid';
import { computed, ref } from 'vue';
import { useUserStore } from '@/stores/user';

const user = useUserStore();

const comment = ref('');
const name = ref('');
const hoverIndex = ref(-1);

const currentRating = ref(0);

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  imdbID: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['update:isOpen']);

const innerIsOpen = computed<boolean>({
  get: () => props.isOpen,
  set: (value) => emit('update:isOpen', value)
});

const onSubmit = () => {
  if (!formValidation()) return;
  user.reviewMovie(props.imdbID, currentRating.value, name.value, comment.value);
  clearValues();
  innerIsOpen.value = false;
};

const formValidation = () => {
  return !(name.value === '' || comment.value === '');
};

const closeModal = () => {
  clearValues();
  innerIsOpen.value = false;
};

const clearValues = () => {
  currentRating.value = 0;
  name.value = '';
  comment.value = '';
};

const setRating = (rating: number) => {
  currentRating.value = rating + 1;
};
</script>
