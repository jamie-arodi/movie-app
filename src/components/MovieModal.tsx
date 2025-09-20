import React, { useEffect } from 'react'
import { X, Star, Calendar, Users, Film } from 'lucide-react'
import { Button } from './ui/button'
import { useHomeContext } from '../hooks/useHomeContext'

export const MovieModal: React.FC = () => {
  const { selectedMovie, isModalOpen, handleCloseModal } = useHomeContext()

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal()
      }
    }

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen, handleCloseModal])

  if (!isModalOpen || !selectedMovie) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with backdrop image */}
        <div className="relative">
          {selectedMovie.backdrop_path ? (
            <div 
              className="h-64 md:h-80 bg-cover bg-center rounded-t-lg"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/w1280${selectedMovie.backdrop_path})`
              }}
            >
              <div className="absolute inset-0 bg-black/60 rounded-t-lg" />
            </div>
          ) : (
            <div className="h-64 md:h-80 bg-gradient-to-r from-red-900/50 to-purple-900/50 rounded-t-lg" />
          )}
          
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCloseModal}
            className="absolute top-4 right-4 text-white hover:bg-black/50"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Movie poster and basic info overlay */}
          <div className="absolute bottom-6 left-6 flex gap-6">
            {selectedMovie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`}
                alt={selectedMovie.title}
                className="w-32 md:w-40 rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-32 md:w-40 h-48 md:h-60 bg-gray-800 rounded-lg flex items-center justify-center">
                <Film className="h-8 w-8 text-gray-400" />
              </div>
            )}
            
            <div className="text-white flex-1">
              <h1 className="text-2xl md:text-4xl font-bold mb-2">{selectedMovie.title}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{selectedMovie.vote_average?.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{selectedMovie.release_date ? new Date(selectedMovie.release_date).getFullYear() : 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{selectedMovie.vote_count?.toLocaleString()} votes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Overview */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Overview</h3>
            <p className="text-gray-300 leading-relaxed">
              {selectedMovie.overview || 'No overview available for this movie.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-800">
            <Button className="bg-red-600 hover:bg-red-700 text-white flex-1">
              Watch Now
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 flex-1">
              Add to Watchlist
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 flex-1">
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}