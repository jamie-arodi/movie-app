import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { usePopularMovies } from '../hooks/useMovies'
import { useSearchMovies } from '../hooks/useSearchMovies'
import type { Movie } from '../types/movie'

interface HomeContextType {
  // Search state
  searchQuery: string
  setSearchQuery: (query: string) => void
  debouncedSearchQuery: string
  
  // Movie data
  displayedMovies: Movie[]
  isLoading: boolean
  currentError: Error | null
  
  // Pagination
  currentPage: number
  setCurrentPage: (page: number) => void
  hasMorePages: boolean
  canLoadMore: boolean
  handleLoadMore: () => void
  
  // Movie modal
  selectedMovie: Movie | null
  setSelectedMovie: (movie: Movie | null) => void
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
  handleMovieClick: (movie: Movie) => void
  handleCloseModal: () => void
  
  // UI state
  isMenuOpen: boolean
  setIsMenuOpen: (open: boolean) => void
}

const HomeContext = createContext<HomeContextType | undefined>(undefined)

export const useHomeContext = () => {
  const context = useContext(HomeContext)
  if (!context) {
    throw new Error('useHomeContext must be used within a HomeProvider')
  }
  return context
}

interface HomeProviderProps {
  children: React.ReactNode
}

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [allMovies, setAllMovies] = useState<Movie[]>([])
  
  // Modal state
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // UI state
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim())
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch data
  const { data: moviesData, isLoading: moviesLoading, error: moviesError } = usePopularMovies(currentPage)
  const { data: searchData, isLoading: searchLoading, error: searchError } = useSearchMovies(debouncedSearchQuery)

  // Update allMovies when new page data is fetched
  useEffect(() => {
    if (moviesData?.results && !debouncedSearchQuery) {
      if (currentPage === 1) {
        // First page - replace all movies
        setAllMovies(moviesData.results)
      } else {
        // Additional pages - append to existing movies
        setAllMovies(prev => [...prev, ...moviesData.results])
      }
    }
  }, [moviesData, currentPage, debouncedSearchQuery])

  // Reset to first page when search query changes
  useEffect(() => {
    if (debouncedSearchQuery) {
      setCurrentPage(1)
      setAllMovies([])
    } else {
      setCurrentPage(1)
    }
  }, [debouncedSearchQuery])

  // Scroll to the newly loaded content when page changes
  useEffect(() => {
    if (currentPage > 1 && !moviesLoading) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        const movieGrid = document.querySelector('[data-movie-grid]')
        if (movieGrid) {
          const newMoviesStart = movieGrid.children[(currentPage - 1) * 20] // Assuming 20 movies per page
          if (newMoviesStart) {
            newMoviesStart.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }
      }, 100)
    }
  }, [currentPage, moviesLoading])

  // Computed values
  const displayedMovies = useMemo(() => {
    if (debouncedSearchQuery && searchData?.results) {
      return searchData.results
    }
    return allMovies
  }, [debouncedSearchQuery, searchData, allMovies])

  const isLoading = debouncedSearchQuery ? searchLoading : moviesLoading
  const currentError = debouncedSearchQuery ? searchError : moviesError

  // Check if there are more pages to load
  const hasMorePages = Boolean(moviesData && currentPage < moviesData.total_pages)
  const canLoadMore = !debouncedSearchQuery && hasMorePages && !isLoading

  const handleLoadMore = () => {
    if (canLoadMore) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedMovie(null)
  }

  const contextValue: HomeContextType = {
    // Search state
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    
    // Movie data
    displayedMovies,
    isLoading,
    currentError,
    
    // Pagination
    currentPage,
    setCurrentPage,
    hasMorePages,
    canLoadMore,
    handleLoadMore,
    
    // Movie modal
    selectedMovie,
    setSelectedMovie,
    isModalOpen,
    setIsModalOpen,
    handleMovieClick,
    handleCloseModal,
    
    // UI state
    isMenuOpen,
    setIsMenuOpen,
  }

  return (
    <HomeContext.Provider value={contextValue}>
      {children}
    </HomeContext.Provider>
  )
}