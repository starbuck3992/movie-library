import axios, { AxiosResponse } from 'axios';

export interface apiSearchMovieRequest {
  s: string; // Search query
  type: string; // Type of result to return
  y: string; // Year of release
  page: number; // Page number to return
}

export interface apiSearchMovieResponse {
  Search: [
    {
      Title: string;
      Year: string;
      imdbID: string;
      Type: string;
      Poster: string;
    }
  ];
  totalResults: string;
  Response: string;
  Error?: string;
}

export interface apiGetMovieRequest {
  i: string; // A valid IMDb ID (e.g. tt1285016)
  plot: string; // Return short or full plot
}

export interface apiGetMovieResponse {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: [
    {
      Source: string;
      Value: string;
    }
  ];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
  Error?: string;
}

export const api = axios.create({
  baseURL: 'http://www.omdbapi.com' // Move this to .env file
});

// Set the AUTH token for any request
api.defaults.params = {};
api.interceptors.request.use(
  function (config) {
    config.params['apikey'] = '8a13b43f'; // Move this to .env file
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor to automatically unwrap the data
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    // Handle errors here
    return Promise.reject(error);
  }
);

export default {
  // Search Movie by title
  searchMovie(searchMovieParams: apiSearchMovieRequest): Promise<apiSearchMovieResponse> {
    return api.get('', {
      params: searchMovieParams
    });
  },

  // Get Movie by ID
  getMovieById(getMovieParams: apiGetMovieRequest): Promise<apiGetMovieResponse> {
    return api.get('', {
      params: getMovieParams
    });
  }
};
