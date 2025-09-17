import React from 'react'
import { useAuthStore } from '../store/authStore'
import { useLogout } from '../hooks/useAuth'
import { useState } from 'react'
import { Film } from 'lucide-react'

export const Home: React.FC = () => {
  const { user } = useAuthStore()
  const [logoutError, setLogoutError] = useState<string | null>(null)
  const logoutMutation = useLogout()

  const handleLogoutClick = async () => {
    setLogoutError(null)
    try {
      await logoutMutation.mutateAsync()
    } catch (error: any) {
      setLogoutError(error?.msg || 'Logout failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Film className="h-8 w-8 text-white" />
            <h1 className="text-white text-3xl font-bold">Movie App</h1>
          </div>
          <p className="text-gray-300">
            Your gateway to unlimited entertainment
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-black/50 border border-gray-700 backdrop-blur-sm rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-white text-2xl font-semibold mb-2">
              Welcome{user?.user_metadata?.firstName ? `, ${user.user_metadata.firstName}` : ''}!
            </h2>
            <p className="text-gray-300">
              You are now logged in and ready to explore movies.
            </p>
          </div>

          {logoutError && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md mb-6">
              {logoutError}
            </div>
          )}

          {/* User Info Card */}
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 mb-8 max-w-lg mx-auto">
            <h3 className="text-white font-semibold mb-4 text-center">User Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Email:</span>
                <span className="text-white">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Role:</span>
                <span className="text-white">{user?.role}</span>
              </div>
              {user?.user_metadata?.firstName && (
                <div className="flex justify-between">
                  <span className="text-gray-300">First Name:</span>
                  <span className="text-white">{user.user_metadata.firstName}</span>
                </div>
              )}
              {user?.user_metadata?.lastName && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Last Name:</span>
                  <span className="text-white">{user.user_metadata.lastName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Coming Soon Content */}
          <div className="text-center mb-8">
            <h3 className="text-white text-xl font-semibold mb-4">Coming Soon</h3>
            <p className="text-gray-300 mb-6">
              Movie browsing, favorites, and more features are being developed!
            </p>
          </div>

          {/* Logout Button */}
          <div className="text-center">
            <button
              onClick={handleLogoutClick}
              disabled={logoutMutation.isPending}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200"
            >
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}