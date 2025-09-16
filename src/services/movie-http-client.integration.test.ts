import { describe, it, expect, vi, beforeEach } from 'vitest'
import { movieHttpClient } from './movie-http-client'
import type { MovieResponse } from '../types/movie'

const mockMovieResponse: MovieResponse = {
  page: 1,
  results: [
    {
      id: 123,
      title: 'Test Movie',
      overview: 'A test movie description',
      poster_path: '/test-poster.jpg',
      backdrop_path: '/test-backdrop.jpg',
      release_date: '2025-01-01',
      vote_average: 8.5,
      vote_count: 1000,
      genre_ids: [28, 12]
    },
    {
      id: 456,
      title: 'Another Test Movie',
      overview: 'Another test movie description',
      poster_path: '/another-poster.jpg',
      backdrop_path: '/another-backdrop.jpg',
      release_date: '2025-02-01',
      vote_average: 7.2,
      vote_count: 750,
      genre_ids: [35, 18]
    }
  ],
  total_pages: 500,
  total_results: 10000
}

describe('MovieHttpClient Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch popular movies and match the interface', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovieResponse,
    } as Response)

    const response: MovieResponse = await movieHttpClient.getPopularMovies(1)
    
    expect(response).toBeDefined()
    expect(response.page).toBe(1)
    expect(Array.isArray(response.results)).toBe(true)
    expect(response.results.length).toBeGreaterThan(0)
    
    const firstMovie = response.results[0]
    expect(firstMovie.id).toBeGreaterThan(0)
    expect(firstMovie.title.length).toBeGreaterThan(0)
    expect(firstMovie.vote_average).toBeGreaterThanOrEqual(0)
    expect(firstMovie.vote_average).toBeLessThanOrEqual(10)

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/movie/popular')
    )
  })

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
