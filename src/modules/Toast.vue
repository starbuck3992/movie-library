<template>
  <div
    v-show="isVisible"
    class="z-50 pointer-events-none fixed top-0 w-full right-0 sm:inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 animate-slide-in-right"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <transition
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          class="text-white pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
          :class="toastClass"
        >
          <div class="p-6">
            <div class="flex items-start">
              <div class="flex-shrink-0 my-auto">
                <component :is="toastIcon" class="h-10 w-10 text-white" aria-hidden="true" />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium">{{ toast.getToast.title }}</p>
                <p class="mt-1 text-sm text-white">
                  {{ toast.getToast.message }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="clearToast"
                  class="inline-flex text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';
import { computed, ref, watch } from 'vue';
import { TOAST_SEVERITY } from '@/enums/ToastSeverityEnum';
import { useToastStore } from '@/stores/toast';

const toast = useToastStore();

const isVisible = ref<boolean>(false);

watch(
  () => toast.getToast.title,
  (newValue) => {
    if (newValue) {
      isVisible.value = true;
      if (toast.life && toast.life > 0) {
        setTimeout(() => {
          clearToast();
        }, toast.life);
      }
    }
  },
  {
    immediate: true
  }
);

const toastClass = computed(() => {
  switch (toast.getToastSeverity) {
    case TOAST_SEVERITY.SUCCESS:
      return 'bg-green-400';
    case TOAST_SEVERITY.WARNING:
      return 'bg-yellow-400';
    case TOAST_SEVERITY.ERROR:
      return 'bg-red-400';
    default:
      return 'bg-gray-400';
  }
});

const toastIcon = computed(() => {
  switch (toast.getToastSeverity) {
    case TOAST_SEVERITY.SUCCESS:
      return CheckCircleIcon;
    case TOAST_SEVERITY.WARNING:
      return ExclamationTriangleIcon;
    case TOAST_SEVERITY.ERROR:
      return XCircleIcon;
    default:
      return XCircleIcon;
  }
});

const clearToast = () => {
  isVisible.value = false;
  toast.clear();
};
</script>

<style scoped>
@keyframes slide-in-right {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}
.animate-slide-in-right {
  animation: slide-in-right 1s;
}
</style>
