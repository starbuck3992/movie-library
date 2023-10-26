import { defineStore } from 'pinia';
import { IMovie } from '@/interfaces/IMovie';
import { IMovieList } from '@/interfaces/IMovieList';
import { apiSearchMovieRequest } from '@/services/api';

interface IState {
  queryParameters: apiSearchMovieRequest;
  movies: IMovie[];
  lists: IMovieList[];
  lastSearchQueryParameters: apiSearchMovieRequest;
}

export const useUserStore = defineStore('user', {
  state: (): IState => ({
    queryParameters: {
      s: '',
      type: '',
      y: '',
      page: 1
    },
    movies: [],
    lists: [],
    lastSearchQueryParameters: {
      s: '',
      type: '',
      y: '',
      page: 1
    }
  }),
  getters: {
    areQueryParametersSet(state) {
      const obj = state.queryParameters;
      return (
        (obj.s !== undefined && obj.s.trim() !== '') || // Check if title is set
        (obj.y !== undefined && obj.y.trim() !== '') || // Check if year is set
        (obj.type !== undefined && obj.type.trim() !== '') // Check if type is set
      );
    },
    getQueryParameters: (state): apiSearchMovieRequest => state.queryParameters,
    getMovies: (state): IMovie[] => state.movies,
    getLists: (state): IMovieList[] => state.lists,
    getLastSearchQueryParameters: (state): apiSearchMovieRequest => state.lastSearchQueryParameters
  },
  actions: {
    addMovie(movie: IMovie) {
      // Check if the movie already exists
      const movieExist = this.movies.find(
        (m) => m.imdbID === movie.imdbID);
      if (movieExist) {
        return;
      }
      this.movies.push(movie);
    },
    getMovie(movieID: string): IMovie | undefined {
      return this.movies.find((movie) => movie.imdbID === movieID);
    },
    rateMovie(movieID: string, rating: number) {
      const movie = this.movies.find(
        (movie) => movie.imdbID === movieID);
      if (movie) {
        movie.rating = rating;
      }
    },
    reviewMovie(movieID: string, rating: number, name: string, comment: string) {
      const movie = this.movies.find(
        (movie) => movie.imdbID === movieID);
      if (movie) {
        movie.rating = rating;
        movie.reviews.push({ name, comment });
      }
    },
    createList(name: string): boolean {
      const list = this.lists.find(
        (list) => list.name === name);
      if (!list) {
        const newList: IMovieList = {
          name,
          moviesIDs: []
        };
        this.lists.push(newList);
        return true;
      }
      return false;
    },
    addMovieToList(listName: string, movieID: string): boolean {
      // Find the list
      const list = this.lists.find(
        (list) => list.name === listName);
      if (list) {
        // Check if the movie id is already in the list
        const movieExist = list.moviesIDs.find(
          (movieId) => movieId === movieID);
        if (movieExist) {
          return false;
        } else {
          list.moviesIDs.push(movieID);
          return true;
        }
      }
      return false;
    },
    setQueryParameters(queryParameters: apiSearchMovieRequest) {
      this.$patch((state) => {
        state.queryParameters = queryParameters;
      });
    },
    setLastSearchQueryParameters(queryParameters: apiSearchMovieRequest) {
      this.$patch((state) => {
        state.lastSearchQueryParameters = queryParameters;
      });
    },
    removeFromList(movieID: string) {
      this.lists.forEach((list) => {
        const index = list.moviesIDs.findIndex(
          (id) => id === movieID);
        if (index !== -1) {
          list.moviesIDs.splice(index, 1);
        }
      });
    }
  },
  persist: true
});
