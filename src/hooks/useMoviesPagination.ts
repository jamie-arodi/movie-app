import { useState, useEffect } from 'react'
import type { Movie } from '../types/movie'

interface UseMoviesPaginationProps {
  moviesData?: {
    results: Movie[]
    total_pages: number
  }
  currentPage: number
  debouncedSearchQuery: string
}

/**
 * Custom hook for managing movie pagination and accumulating results
 * @param moviesData - The movies data from API
 * @param currentPage - Current page number
 * @param debouncedSearchQuery - Debounced search query
 * @returns allMovies state and setter function
 */
export const useMoviesPagination = ({
  moviesData,
  currentPage,
  debouncedSearchQuery
}: UseMoviesPaginationProps) => {
  const [allMovies, setAllMovies] = useState<Movie[]>([])

  useEffect(() => {
    if (moviesData?.results && !debouncedSearchQuery) {
      if (currentPage === 1) {
        setAllMovies(moviesData.results)
      } else {
        setAllMovies(prev => [...prev, ...moviesData.results])
      }
    }
  }, [moviesData, currentPage, debouncedSearchQuery])

  return { allMovies, setAllMovies }
}