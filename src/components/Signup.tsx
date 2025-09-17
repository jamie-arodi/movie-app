import React, { useState } from 'react'
import { useSignup } from '../hooks/useAuth'
import { useAuthStore } from '../store/authStore'
import type { SignupFormData } from '../types/auth'

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
      const { confirmPassword, ...signupData } = credentials
      await signupMutation.mutateAsync(signupData)
      onSuccess?.()
    } catch (error: any) {
      setError(error?.msg || 'Signup failed')
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
      <h2 className="text-xl font-bold mb-6 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 text-left">
          <label htmlFor="firstName" className="block mb-2 font-bold">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={credentials.firstName}
            onChange={handleChange}
            required
            disabled={signupMutation.isPending}
            className="w-full p-2 border border-gray-300 rounded text-base box-border focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="mb-4 text-left">
          <label htmlFor="lastName" className="block mb-2 font-bold">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={credentials.lastName}
            onChange={handleChange}
            required
            disabled={signupMutation.isPending}
            className="w-full p-2 border border-gray-300 rounded text-base box-border focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="mb-4 text-left">
          <label htmlFor="email" className="block mb-2 font-bold">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            disabled={signupMutation.isPending}
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
            disabled={signupMutation.isPending}
            className="w-full p-2 border border-gray-300 rounded text-base box-border focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="mb-4 text-left">
          <label htmlFor="confirmPassword" className="block mb-2 font-bold">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={credentials.confirmPassword}
            onChange={handleChange}
            required
            disabled={signupMutation.isPending}
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
            disabled={signupMutation.isPending}
            className="bg-cyan-400 text-gray-800 border-none px-6 py-3 rounded cursor-pointer font-bold flex-1 hover:bg-cyan-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {signupMutation.isPending ? 'Signing up...' : 'Sign Up'}
          </button>
          
          <button 
            type="button"
            onClick={handleBackToHome}
            disabled={signupMutation.isPending}
            className="bg-gray-600 text-white border-none px-6 py-3 rounded cursor-pointer font-bold hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Back to Home
          </button>
        </div>
      </form>
    </div>
  )
}
