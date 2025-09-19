import { describe, it, expect, vi, beforeEach } from 'vitest'
import { movieHttpClient } from '../services/movie-http-client'
import type { MovieResponse } from '../types/movie'
import { originalFetch } from './setup'
import { mockMovieResponse } from './mocks'

describe('MovieHttpClient Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch popular movies and match the interface', async () => {

    // Restore real fetch for live API calls
    globalThis.fetch = originalFetch
    
    try {
      const response: MovieResponse = await movieHttpClient.getPopularMovies(1)
      
      expect(response).toBeDefined()
      expect(typeof response.page).toBe('number')
      expect(response.page).toBe(1)
      expect(Array.isArray(response.results)).toBe(true)
      expect(response.results.length).toBeGreaterThan(0)
      expect(response.results.length).toBeLessThanOrEqual(20)
      expect(typeof response.total_pages).toBe('number')
      expect(typeof response.total_results).toBe('number')
      expect(response.total_results).toBeGreaterThan(0)
      
      const firstMovie = response.results[0]
      expect(typeof firstMovie.id).toBe('number')
      expect(firstMovie.id).toBeGreaterThan(0)
      expect(typeof firstMovie.title).toBe('string')
      expect(firstMovie.title.length).toBeGreaterThan(0)
      expect(typeof firstMovie.overview).toBe('string')
      expect(typeof firstMovie.vote_average).toBe('number')
      expect(firstMovie.vote_average).toBeGreaterThanOrEqual(0)
      expect(firstMovie.vote_average).toBeLessThanOrEqual(10)
      expect(typeof firstMovie.vote_count).toBe('number')
      expect(firstMovie.vote_count).toBeGreaterThanOrEqual(0)
      expect(typeof firstMovie.release_date).toBe('string')
      expect(Array.isArray(firstMovie.genre_ids)).toBe(true)
      
      if (firstMovie.poster_path) {
        expect(typeof firstMovie.poster_path).toBe('string')
        expect(firstMovie.poster_path).toMatch(/^\/.*\.(jpg|png|webp)$/i)
      }
      if (firstMovie.backdrop_path) {
        expect(typeof firstMovie.backdrop_path).toBe('string')
        expect(firstMovie.backdrop_path).toMatch(/^\/.*\.(jpg|png|webp)$/i)
      }

      expect(response.results.every(movie => 
        movie.id > 0 && 
        movie.title.length > 0 && 
        movie.vote_average >= 0 && 
        movie.vote_average <= 10
      )).toBe(true)
    } finally {
      globalThis.fetch = vi.fn()
    }
  }, 10000)

  it('should use cache for repeated requests', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockMovieResponse,
    } as Response)

    await movieHttpClient.getTopRatedMovies(1)
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    
    await movieHttpClient.getTopRatedMovies(1)
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    
    const firstResponse = await movieHttpClient.getTopRatedMovies(1)
    const secondResponse = await movieHttpClient.getTopRatedMovies(1)
    
    expect(firstResponse).toEqual(secondResponse)
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
  })
})
