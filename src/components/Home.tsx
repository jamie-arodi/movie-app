import React, { useState, useMemo } from 'react'
import { useAuthStore } from '../store/authStore'
import { useLogout } from '../hooks/useAuth'
import { usePopularMovies } from '../hooks/useMovies'
import { Search, Film, LogOut, User, Menu, Star, Calendar } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'

export const Home: React.FC = () => {
  const { user } = useAuthStore()
  const [logoutError, setLogoutError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const logoutMutation = useLogout()

  const { data: moviesData, isLoading: moviesLoading, error: moviesError } = usePopularMovies(1)

  const filteredMovies = useMemo(() => {
    if (!moviesData?.results) return []
    
    if (!searchQuery) return moviesData.results
    
    return moviesData.results.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.overview.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [moviesData, searchQuery])

  const handleLogoutClick = async () => {
    setLogoutError(null)
    try {
      await logoutMutation.mutateAsync()
    } catch (error: any) {
      setLogoutError(error?.msg || 'Logout failed')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Film className="h-8 w-8 text-red-500" />
              <span className="text-xl font-bold">MovieFlix</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-white hover:text-red-500 transition-colors">Home</a>
              <a href="#" className="text-gray-300 hover:text-red-500 transition-colors">Movies</a>
              <a href="#" className="text-gray-300 hover:text-red-500 transition-colors">TV Shows</a>
              <a href="#" className="text-gray-300 hover:text-red-500 transition-colors">My List</a>
            </nav>

            {/* Search and User Controls */}
            <div className="flex items-center space-x-4">
              {/* User Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-300 hover:text-white"
                >
                  <User className="h-5 w-5" />
                </Button>
                
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm font-medium text-white">
                        {user?.user_metadata?.firstName || 'User'}
                      </p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={handleLogoutClick}
                      disabled={logoutMutation.isPending}
                      className="w-full justify-start text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-300 hover:text-white"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXIlMjBjaW5lbWF8ZW58MXx8fHwxNzU4MDIzMTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
            Unlimited movies, TV shows, and more
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8">
            Watch anywhere. Cancel anytime.
          </p>
          
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search movies, shows, actors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-gray-600 text-white placeholder-gray-400 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Error Display */}
      {(logoutError || moviesError) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md">
            {logoutError || `Failed to load movies: ${moviesError?.message}`}
          </div>
        </div>
      )}

      {/* Movies Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Popular Movies</h2>
          <p className="text-gray-400">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Trending now'}
          </p>
        </div>

        {moviesLoading ? (
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredMovies.map((movie) => (
              <div key={movie.id} className="group cursor-pointer">
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

        {filteredMovies.length === 0 && !moviesLoading && searchQuery && (
          <div className="text-center py-12">
            <Film className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No movies found</h3>
            <p className="text-gray-400">Try searching for something else</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Content</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Movies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">TV Shows</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Originals</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Film className="h-5 w-5 text-red-500" />
              <span className="font-semibold">MovieFlix</span>
            </div>
            <p>&copy; 2024 MovieFlix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}