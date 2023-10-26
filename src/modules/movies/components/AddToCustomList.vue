<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton class="flex items-center group">
        <span class="sr-only">add to favourites</span>
        <FolderPlusIcon :class="[
          'text-blue-700 w-7 h-7 cursor-pointer hover:text-yellow-500 hover:animate-pulse hover:scale-125'
        ]" title="add to favourites"></FolderPlusIcon>
        <span class="text-gray-500 text-sm opacity-0 group-hover:opacity-100 ml-1">Add to list</span>
      </MenuButton>
    </div>

    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
      <MenuItems
        class="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div class="py-1">
          <div>
            <p @click="toggleShowList" v-if="!showList && user.getLists.length > 0" :class="[
              'text-gray-700 px-4 py-2 text-sm flex cursor-pointer group hover:text-black hover:bg-gray-100'
            ]">
              <PlusIcon class="h-5 w-5 group-hover:text-black"></PlusIcon>Add to list
            </p>
            <p @click="toggleShowList" v-if="showList" :class="[
              'text-gray-700 px-4 py-2 text-sm flex cursor-pointer group hover:text-black hover:bg-gray-100'
            ]">
              <MinusIcon class="h-5 w-5 group-hover:text-black"></MinusIcon>Hide list
            </p>
          </div>
          <div v-show="showList" class="ml-5" id="favourites list">
            <MenuItem v-for="list in user.getLists" :key="list.name" v-slot="{ active }">
            <button @click="addMovieToList(list.name, props.movieImdbID)" :class="[
              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
              'px-4 py-2 text-sm flex'
            ]">
              <DocumentTextIcon class="h-5 w-5 text-gray-600"></DocumentTextIcon>{{ list.name }}
            </button>
            </MenuItem>
          </div>
          <MenuItem v-slot="{ active }">
          <a href="#" @click="createListDialog = true" :class="[
            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
            'px-4 py-2 text-sm flex'
          ]">
            <PlusIcon class="h-5 w-5 text-gray-600"></PlusIcon>Create new list
          </a>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>

  <TransitionRoot as="template" :show="createListDialog">
    <Dialog as="div" class="relative z-10" :open="createListDialog" @close="createListDialog = false">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div class="flex items-center">
                <label class="" for="listName">Name of the list:</label>
                <input id="listName" v-model="newListName" type="text" placeholder="Input name" :class="[
                  newListName ? 'ring-green-500 ring-1' : 'ring-red-700 ring-1',
                  'block w-full flex-1 ml-2 rounded-md pl-2 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:outline-none'
                ]" />
              </div>
              <div class="flex w-full justify-end mt-3">
                <button @click="createNewList" type="button"
                  class="w-full mr-0 ml-auto rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto">
                  Create
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue';
import {
  FolderPlusIcon,
  PlusIcon,
  MinusIcon,
  DocumentTextIcon
} from '@heroicons/vue/20/solid';
import { ref } from 'vue';
import { TOAST_SEVERITY } from '@/enums/ToastSeverityEnum';
import { useToastStore } from '@/stores/toast';
import { useUserStore } from '@/stores/user';

const user = useUserStore();
const toast = useToastStore();

const showList = ref(false); // show list of all lists
const createListDialog = ref(false);
const newListName = ref('');

const props = defineProps({
  movieImdbID: {
    type: String,
    required: true
  }
});

const toggleShowList = () => {
  showList.value = !showList.value;
};

const addMovieToList = (listName: string, movieID: string) => {
  const addMovieSuccess = user.addMovieToList(listName, movieID);
  if (!addMovieSuccess) {
    toast.add(
      TOAST_SEVERITY.WARNING,
      'List not found or movie already exists in the list',
      '',
      2000
    );
    return;
  }
  toast.add(TOAST_SEVERITY.SUCCESS, 'Movie added to list', '', 2000);
};

const createNewList = () => {
  if (newListName.value.trim() === '') {
    toast.add(TOAST_SEVERITY.WARNING, 'List name cannot be empty', '', 2000);
    return;
  }
  const createListSuccess = user.createList(newListName.value);
  if (!createListSuccess) {
    toast.add(TOAST_SEVERITY.WARNING, 'List already exists', '', 2000);
    return;
  }
  toast.add(TOAST_SEVERITY.SUCCESS, 'List created', '', 2000);
  createListDialog.value = false;
};
</script>
