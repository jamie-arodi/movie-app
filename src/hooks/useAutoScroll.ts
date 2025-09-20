import { useEffect } from 'react'

interface UseAutoScrollProps {
  currentPage: number
  isLoading: boolean
  gridSelector?: string
  itemsPerPage?: number
}

/**
 * Custom hook for automatically scrolling to newly loaded content
 * @param currentPage - Current page number
 * @param isLoading - Whether content is currently loading
 * @param gridSelector - CSS selector for the movie grid (default: '[data-movie-grid]')
 * @param itemsPerPage - Number of items per page (default: 20)
 */
export const useAutoScroll = ({
  currentPage,
  isLoading,
  gridSelector = '[data-movie-grid]',
  itemsPerPage = 20
}: UseAutoScrollProps) => {
  // Scroll to the newly loaded content when page changes
  useEffect(() => {
    if (currentPage > 1 && !isLoading) {
      // Small delay to ensure content is rendered
      const scrollTimer = setTimeout(() => {
        const movieGrid = document.querySelector(gridSelector)
        if (movieGrid) {
          const newMoviesStartIndex = (currentPage - 1) * itemsPerPage
          const newMoviesStart = movieGrid.children[newMoviesStartIndex]
          if (newMoviesStart) {
            newMoviesStart.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            })
          }
        }
      }, 100)

      return () => clearTimeout(scrollTimer)
    }
  }, [currentPage, isLoading, gridSelector, itemsPerPage])
}