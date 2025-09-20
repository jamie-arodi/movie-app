import React, { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useLogout } from '../hooks/useAuth'
import { Film, LogOut, User, Menu } from 'lucide-react'
import { Button } from './ui/button'
import { useHomeContext } from '../hooks/useHomeContext'
import type { AuthError } from '../types/auth'

export const TopNav: React.FC = () => {
  const { user, clearAuthentication, isTokenExpired } = useAuthStore()
  const { isMenuOpen, setIsMenuOpen } = useHomeContext()
  const [logoutError, setLogoutError] = useState<string | null>(null)
  const logoutMutation = useLogout()

  const handleLogoutClick = async () => {
    setLogoutError(null)
    
    if (isTokenExpired()) {
      clearAuthentication()
      return
    }
  
    try {
      await logoutMutation.mutateAsync()
    } catch (error) {
      const authError = error as AuthError
      setLogoutError(authError?.msg || 'Logout failed')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-red-500" />
            <span className="text-xl font-bold">Movie App</span>
          </div>
          {/* Search and User Controls */}
          <div className="flex items-center space-x-4">
            {/* Welcome Message */}
            <div className="hidden sm:block text-sm text-gray-300">
              Welcome back, <span className="text-white font-medium">{user?.user_metadata?.firstName || 'User'}</span>
            </div>

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

      {/* Error Display */}
      {logoutError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md">
            {logoutError}
          </div>
        </div>
      )}
    </header>
  )
}