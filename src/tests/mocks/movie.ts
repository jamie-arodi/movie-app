import type { MovieResponse } from '../../types/movie'

export const mockMovieResponse: MovieResponse = {
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