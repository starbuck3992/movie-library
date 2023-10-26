import { defineStore } from 'pinia';
import { TOAST_SEVERITY } from '@/enums/ToastSeverityEnum';

interface State {
  severity: TOAST_SEVERITY;
  title: string;
  message: string;
  life: number | null;
}

export const useToastStore = defineStore('toast', {
  state: (): State => ({
    severity: TOAST_SEVERITY.INFO,
    title: '',
    message: '',
    life: null
  }),
  getters: {
    getToast: (state) => state,
    getToastSeverity: (state) => state.severity,
    getToastIsSet: (state) => state.message !== ''
  },
  actions: {
    add(severity: TOAST_SEVERITY, title: string, message: string, life?: number) {
      this.severity = severity;
      this.title = title;
      this.message = message;
      this.life = life ? life : null;
    },
    clear() {
      this.$reset();
    }
  }
});
