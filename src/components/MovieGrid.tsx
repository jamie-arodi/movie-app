import React from 'react'
import { Film, Star, Calendar } from 'lucide-react'
import { Button } from './ui/button'
import { useHomeContext } from '../contexts/HomeContext'
import type { Movie } from '../types/movie'

export const MovieGrid: React.FC = () => {
  const {
    displayedMovies,
    isLoading,
    currentError,
    debouncedSearchQuery,
    currentPage,
    canLoadMore,
    handleLoadMore,
    handleMovieClick
  } = useHomeContext()

  if (currentError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md">
          Failed to load movies: {currentError.message}
        </div>
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">
          {debouncedSearchQuery ? 'Search Results' : 'Popular Movies'}
          {displayedMovies.length > 0 && (
            <span className="text-lg text-gray-400 ml-2">({displayedMovies.length} movies)</span>
          )}
        </h2>
        <p className="text-gray-400">
          {debouncedSearchQuery 
            ? `Results for "${debouncedSearchQuery}"` 
            : `Trending now • Page ${currentPage}`
          }
        </p>
      </div>

      {isLoading && currentPage === 1 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-800 aspect-[2/3] rounded-lg mb-2"></div>
              <div className="bg-gray-800 h-4 rounded mb-1"></div>
              <div className="bg-gray-800 h-3 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6" data-movie-grid>
          {displayedMovies.map((movie: Movie) => (
            <div 
              key={movie.id} 
              className="group cursor-pointer"
              onClick={() => handleMovieClick(movie)}
            >
              <div className="relative aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden mb-3 group-hover:scale-105 transition-transform duration-300">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film className="h-12 w-12 text-gray-600" />
                  </div>
                )}
                
                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-black/80 rounded-full px-2 py-1 flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs font-medium">{movie.vote_average?.toFixed(1)}</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-red-500 transition-colors">
                  {movie.title}
                </h3>
                <div className="flex items-center text-xs text-gray-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{movie.release_date?.split('-')[0] || 'Unknown'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {displayedMovies.length === 0 && !isLoading && debouncedSearchQuery && (
        <div className="text-center py-12">
          <Film className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No movies found</h3>
          <p className="text-gray-400">Try searching for something else</p>
        </div>
      )}

      {/* Load More Button */}
      {canLoadMore && (
        <div className="text-center mt-12">
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            {isLoading ? 'Loading...' : 'Load More Movies'}
          </Button>
        </div>
      )}

      {/* Show loading indicator when loading more pages */}
      {isLoading && currentPage > 1 && (
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 text-gray-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
            <span>Loading more movies...</span>
          </div>
        </div>
      )}
    </main>
  )
}