import { RouteRecordRaw } from 'vue-router';
import { ROUTES } from '@/enums/RoutesEnum';
import CustomList from '@/modules/movies/CustomList.vue';
import Detail from '@/modules/movies/Detail.vue';
import List from '@/modules/movies/List.vue';
import Rated from '@/modules/movies/Rated.vue';
import Recommended from '@/modules/movies/Recommended.vue';

const routes: Array<RouteRecordRaw> = [
  // Public routes
  {
    path: '/',
    name: ROUTES.MOVIE_LIST_PAGE,
    component: List
  },
  {
    path: '/movies/:imdbID',
    name: ROUTES.MOVIE_DETAIL_PAGE,
    component: Detail,
    props: true
  },
  {
    path: '/lists/:movieListName',
    name: ROUTES.MOVIE_CUSTOM_LIST_PAGE,
    component: CustomList,
    props: true
  },
  {
    path: '/recommended',
    name: ROUTES.MOVIE_RECOMMENDED_PAGE,
    component: Recommended
  },
  {
    path: '/rated',
    name: ROUTES.MOVIE_RATED_PAGE,
    component: Rated
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: {
      name: ROUTES.MOVIE_LIST_PAGE,
      params: {}
    }
  }
];

export default routes;
