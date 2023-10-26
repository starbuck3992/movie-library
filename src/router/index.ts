import { createWebHistory, createRouter } from 'vue-router';
import routes from '../router/routes';

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 };
  }
});

export default router;
