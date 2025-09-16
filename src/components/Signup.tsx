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
    <div className="signup-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={credentials.firstName}
            onChange={handleChange}
            required
            disabled={signupMutation.isPending}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={credentials.lastName}
            onChange={handleChange}
            required
            disabled={signupMutation.isPending}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            disabled={signupMutation.isPending}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            disabled={signupMutation.isPending}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={credentials.confirmPassword}
            onChange={handleChange}
            required
            disabled={signupMutation.isPending}
          />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-buttons">
          <button 
            type="submit" 
            disabled={signupMutation.isPending}
            className="submit-button"
          >
            {signupMutation.isPending ? 'Signing up...' : 'Sign Up'}
          </button>
          
          <button 
            type="button"
            onClick={handleBackToHome}
            className="secondary-button"
            disabled={signupMutation.isPending}
          >
            Back to Home
          </button>
        </div>
      </form>
    </div>
  )
}
