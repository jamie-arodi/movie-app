import type { Movie } from './movie'

export interface HomeContextType {
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

export interface HomeProviderProps {
  children: React.ReactNode
}