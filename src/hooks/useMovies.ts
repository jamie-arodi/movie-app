import { useQuery } from '@tanstack/react-query'
import { movieHttpClient } from '../services/movie-http-client'
import type { MovieResponse } from '../types/movie'

export const usePopularMovies = (page: number = 1) => {
  return useQuery<MovieResponse, Error>({
    queryKey: ['movies', 'popular', page],
    queryFn: () => movieHttpClient.getPopularMovies(page),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}