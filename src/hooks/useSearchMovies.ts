import { useQuery } from '@tanstack/react-query'
import { movieHttpClient } from '../services/movie-http-client'
import type { MovieResponse } from '../types/movie'

export const useSearchMovies = (query: string, page: number = 1) => {
  return useQuery<MovieResponse>({
    queryKey: ['searchMovies', query, page],
    queryFn: () => movieHttpClient.searchMovies(query, page),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  })
}