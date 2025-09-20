import { useEffect } from 'react'
import type { Movie } from '../types/movie'

interface UseSearchResetProps {
  debouncedSearchQuery: string
  setCurrentPage: (page: number) => void
  setAllMovies: (movies: Movie[]) => void
}

/**
 * Custom hook for resetting pagination when search query changes
 * @param debouncedSearchQuery - The debounced search query
 * @param setCurrentPage - Function to set current page
 * @param setAllMovies - Function to set all movies
 */
export const useSearchReset = ({
  debouncedSearchQuery,
  setCurrentPage,
  setAllMovies
}: UseSearchResetProps) => {
  useEffect(() => {
    if (debouncedSearchQuery) {
      setCurrentPage(1)
      setAllMovies([])
    } else {
      setCurrentPage(1)
    }
  }, [debouncedSearchQuery, setCurrentPage, setAllMovies])
}