import React, { useState } from 'react'
import { useLogin } from '../hooks/useAuth'
import { useAuthStore } from '../store/authStore'
import type { LoginCredentials } from '../types/auth'

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
    } catch (error: any) {
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

  const handleBackToHome = () => {
    setCurrentView('home')
  }

  return (
    <div className="max-w-md mx-auto p-8 border border-gray-300 rounded-lg bg-gray-50">
      <h2 className="text-xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 text-left">
          <label htmlFor="email" className="block mb-2 font-bold">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            disabled={loginMutation.isPending}
            className="w-full p-2 border border-gray-300 rounded text-base box-border focus:outline-none focus:border-cyan-400"
          />
        </div>
        
        <div className="mb-4 text-left">
          <label htmlFor="password" className="block mb-2 font-bold">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            disabled={loginMutation.isPending}
            className="w-full p-2 border border-gray-300 rounded text-base box-border focus:outline-none focus:border-cyan-400"
          />
        </div>

        {error && (
          <div className="text-red-600 bg-red-100 border border-red-300 px-3 py-2 rounded my-4">
            {error}
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <button 
            type="submit" 
            disabled={loginMutation.isPending}
            className="bg-cyan-400 text-gray-800 border-none px-6 py-3 rounded cursor-pointer font-bold flex-1 hover:bg-cyan-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </button>
          
          <button 
            type="button"
            onClick={handleBackToHome}
            disabled={loginMutation.isPending}
            className="bg-gray-600 text-white border-none px-6 py-3 rounded cursor-pointer font-bold hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Back to Home
          </button>
        </div>
      </form>
    </div>
  )
}
