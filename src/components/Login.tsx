import React, { useState } from 'react'
import { useLogin } from '../hooks/useAuth'
import { useAuthStore } from '../store/authStore'
import type { AuthError, LoginCredentials } from '../types/auth'
import { Film } from 'lucide-react'

interface LoginProps {
  onSuccess?: () => void
}

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  })
  const [error, setError] = useState<string | null>(null)

  const loginMutation = useLogin()
  const { setCurrentView } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await loginMutation.mutateAsync(credentials)
      onSuccess?.()
    } catch (err) {
      const error = err as AuthError
      setError(error?.msg || 'Login failed')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Film className="h-8 w-8 text-white" />
            <h1 className="text-white text-2xl">Movie App</h1>
          </div>
          <p className="text-gray-300">
            Your gateway to unlimited entertainment
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-black/50 border border-gray-700 backdrop-blur-sm rounded-lg shadow-lg">
          <div className="text-center p-6 pb-2">
            <h2 className="text-white text-xl font-semibold">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Sign in to your account to continue
            </p>
          </div>
          <div className="p-6 pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-white text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  disabled={loginMutation.isPending}
                  className="w-full p-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-white text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  disabled={loginMutation.isPending}
                  className="w-full p-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200"
              >
                {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={() => setCurrentView('signup')}
                  disabled={loginMutation.isPending}
                  className="text-red-400 hover:text-red-300 underline disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
