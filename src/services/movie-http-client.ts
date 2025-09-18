import type { Movie, MovieResponse } from "../types/movie";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class MovieHttpClient {
  private cache = new Map<string, CacheEntry<unknown>>();
  private readonly CACHE_DURATION = 5 * 60 * 1000;

  private isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.CACHE_DURATION;
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (entry && !this.isExpired(entry.timestamp)) {
      return entry.data;
    }
    if (entry) {
      this.cache.delete(key);
    }
    return null;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  private async fetchFromAPI<T>(endpoint: string): Promise<T> {
    const cacheKey = endpoint;
    const cachedData = this.getFromCache<T>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const url = `${API_BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = (await response.json()) as T;
    this.setCache(cacheKey, data);
    return data;
  }

  async getPopularMovies(page: number = 1): Promise<MovieResponse> {
    return this.fetchFromAPI<MovieResponse>(`/movie/popular?page=${page}`);
  }

  async getTopRatedMovies(page: number = 1): Promise<MovieResponse> {
    return this.fetchFromAPI<MovieResponse>(`/movie/top_rated?page=${page}`);
  }

  async getNowPlayingMovies(page: number = 1): Promise<MovieResponse> {
    return this.fetchFromAPI<MovieResponse>(`/movie/now_playing?page=${page}`);
  }

  async getUpcomingMovies(page: number = 1): Promise<MovieResponse> {
    return this.fetchFromAPI<MovieResponse>(`/movie/upcoming?page=${page}`);
  }

  async getMovieDetails(movieId: number): Promise<Movie> {
    return this.fetchFromAPI<Movie>(`/movie/${movieId}`);
  }

  async searchMovies(query: string, page: number = 1): Promise<MovieResponse> {
    return this.fetchFromAPI<MovieResponse>(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
  }
}

export const movieHttpClient = new MovieHttpClient();
