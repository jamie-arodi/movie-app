import React, { useState } from 'react'
import { useSignup } from '../hooks/useAuth'
import { useAuthStore } from '../store/authStore'
import type { SignupFormData, AuthError } from '../types/auth'
import { Film } from 'lucide-react'

interface SignupProps {
  onSuccess?: () => void
}

export const Signup: React.FC<SignupProps> = ({ onSuccess }) => {
  const [credentials, setCredentials] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  })
  const [error, setError] = useState<string | null>(null)

  const signupMutation = useSignup()
  const { setCurrentView } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (credentials.password !== credentials.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const { confirmPassword: _confirmPassword, ...signupData } = credentials
      await signupMutation.mutateAsync(signupData)
      onSuccess?.()
    } catch (error) {
      const authError = error as AuthError
      setError(authError?.msg || 'Signup failed')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBackToHome = () => {
    setCurrentView('home')
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

        {/* Signup Form */}
        <div className="bg-black/50 border border-gray-700 backdrop-blur-sm rounded-lg shadow-lg">
          <div className="text-center p-6 pb-2">
            <h2 className="text-white text-xl font-semibold">
              Create Account
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Join us to start your movie journey
            </p>
          </div>
          <div className="p-6 pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-white text-sm font-medium">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={credentials.firstName}
                    onChange={handleChange}
                    required
                    disabled={signupMutation.isPending}
                    className="w-full p-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-white text-sm font-medium">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={credentials.lastName}
                    onChange={handleChange}
                    required
                    disabled={signupMutation.isPending}
                    className="w-full p-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

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
                  disabled={signupMutation.isPending}
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
                  disabled={signupMutation.isPending}
                  className="w-full p-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-white text-sm font-medium">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={credentials.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={signupMutation.isPending}
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
                disabled={signupMutation.isPending}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200"
              >
                {signupMutation.isPending ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <button
                  onClick={handleBackToHome}
                  disabled={signupMutation.isPending}
                  className="text-red-400 hover:text-red-300 underline disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  Return to Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
