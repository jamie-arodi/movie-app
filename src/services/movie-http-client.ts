import type { Movie, MovieResponse } from "../types/movie";

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

interface CacheEntry {
  data: any;
  timestamp: number;
}

class MovieHttpClient {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_DURATION = 5 * 60 * 1000;

  private isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.CACHE_DURATION;
  }

  private getFromCache(key: string): any | null {
    const entry = this.cache.get(key);
    if (entry && !this.isExpired(entry.timestamp)) {
      return entry.data;
    }
    if (entry) {
      this.cache.delete(key);
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private async fetchFromAPI(endpoint: string): Promise<any> {
    const cacheKey = endpoint;
    const cachedData = this.getFromCache(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    const url = `${API_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    this.setCache(cacheKey, data);
    return data;
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

  //is this method really necessary if we are loading the image via src???
  getImageUrl(imagePath: string, size: string = 'w500'): string {
    return `https://image.tmdb.org/t/p/${size}${imagePath}`;
  }
}

export const movieHttpClient = new MovieHttpClient();
