import type { Movie, MovieResponse } from "../types/movie";

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

class MovieHttpClient {
  private async fetchFromAPI(endpoint: string): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    return response.json();
  }

  async getPopularMovies(page: number = 1): Promise<MovieResponse> {
    return this.fetchFromAPI(`/movie/popular?page=${page}`);
  }

  async getTopRatedMovies(page: number = 1): Promise<MovieResponse> {
    return this.fetchFromAPI(`/movie/top_rated?page=${page}`);
  }

  async getNowPlayingMovies(page: number = 1): Promise<MovieResponse> {
    return this.fetchFromAPI(`/movie/now_playing?page=${page}`);
  }

  async getUpcomingMovies(page: number = 1): Promise<MovieResponse> {
    return this.fetchFromAPI(`/movie/upcoming?page=${page}`);
  }

  async getMovieDetails(movieId: number): Promise<Movie> {
    return this.fetchFromAPI(`/movie/${movieId}`);
  }

  async searchMovies(query: string, page: number = 1): Promise<MovieResponse> {
    return this.fetchFromAPI(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
  }

  getImageUrl(imagePath: string, size: string = 'w500'): string {
    return `https://image.tmdb.org/t/p/${size}${imagePath}`;
  }
}

export const movieHttpClient = new MovieHttpClient();
