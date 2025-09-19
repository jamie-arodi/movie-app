import React from 'react'
import { X, Star, Calendar, Clock, Users } from 'lucide-react'
import { Button } from './ui/button'

interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  runtime?: number
  genres?: Array<{ id: number; name: string }>
  production_companies?: Array<{ id: number; name: string }>
}

interface MovieModalProps {
  movie: Movie | null
  isOpen: boolean
  onClose: () => void
}

export const MovieModal: React.FC<MovieModalProps> = ({ movie, isOpen, onClose }) => {
  if (!isOpen || !movie) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
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
          {movie.backdrop_path ? (
            <div 
              className="h-64 md:h-80 bg-cover bg-center rounded-t-lg"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`
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
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-black/50"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Movie poster and basic info overlay */}
          <div className="absolute bottom-6 left-6 flex gap-6">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                className="w-32 md:w-40 rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-32 md:w-40 h-48 md:h-60 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">No Image</span>
              </div>
            )}
            
            <div className="text-white flex-1">
              <h1 className="text-2xl md:text-4xl font-bold mb-2">{movie.title}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{movie.vote_average?.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}</span>
                </div>
                {movie.runtime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{movie.runtime} min</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{movie.vote_count?.toLocaleString()} votes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Overview */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Overview</h3>
            <p className="text-gray-300 leading-relaxed">
              {movie.overview || 'No overview available for this movie.'}
            </p>
          </div>

          {/* Production Companies */}
          {movie.production_companies && movie.production_companies.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-2">Production Companies</h3>
              <div className="text-gray-300 text-sm">
                {movie.production_companies.map((company, index) => (
                  <span key={company.id}>
                    {company.name}
                    {index < movie.production_companies!.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

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