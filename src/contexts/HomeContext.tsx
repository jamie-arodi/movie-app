import React, { createContext, useContext, useState, useMemo } from 'react'
import { usePopularMovies } from '../hooks/useMovies'
import { useSearchMovies } from '../hooks/useSearchMovies'
import { useDebounce } from '../hooks/useDebounce'
import { useMoviesPagination } from '../hooks/useMoviesPagination'
import { useSearchReset } from '../hooks/useSearchReset'
import { useAutoScroll } from '../hooks/useAutoScroll'
import type { Movie } from '../types/movie'
import type { HomeContextType, HomeProviderProps } from '../types/home'

const HomeContext = createContext<HomeContextType | undefined>(undefined)

export const useHomeContext = () => {
  const context = useContext(HomeContext)
  if (!context) {
    throw new Error('useHomeContext must be used within a HomeProvider')
  }
  return context
}

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 500)
  
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { data: moviesData, isLoading: moviesLoading, error: moviesError } = usePopularMovies(currentPage)
  const { data: searchData, isLoading: searchLoading, error: searchError } = useSearchMovies(debouncedSearchQuery)

  const { allMovies, setAllMovies } = useMoviesPagination({
    moviesData,
    currentPage,
    debouncedSearchQuery
  })

  useSearchReset({
    debouncedSearchQuery,
    setCurrentPage,
    setAllMovies
  })

  useAutoScroll({
    currentPage,
    isLoading: moviesLoading
  })

  const displayedMovies = useMemo(() => {
    if (debouncedSearchQuery && searchData?.results) {
      return searchData.results
    }
    return allMovies
  }, [debouncedSearchQuery, searchData, allMovies])

  const isLoading = debouncedSearchQuery ? searchLoading : moviesLoading
  const currentError = debouncedSearchQuery ? searchError : moviesError

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
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    displayedMovies,
    isLoading,
    currentError,
    currentPage,
    setCurrentPage,
    hasMorePages,
    canLoadMore,
    handleLoadMore,
    selectedMovie,
    setSelectedMovie,
    isModalOpen,
    setIsModalOpen,
    handleMovieClick,
    handleCloseModal,
    isMenuOpen,
    setIsMenuOpen,
  }

  return (
    <HomeContext.Provider value={contextValue}>
      {children}
    </HomeContext.Provider>
  )
}