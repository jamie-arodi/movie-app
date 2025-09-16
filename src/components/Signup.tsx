import React, { useState } from 'react'
import { useSignup } from '../hooks/useAuth'
import type { SignupFormData } from '../types/auth'

interface SignupProps {
  onSuccess?: () => void
}

export const Signup: React.FC<SignupProps> = ({ onSuccess }) => {
  const [credentials, setCredentials] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: ''
  })

  const signupMutation = useSignup()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (credentials.password !== credentials.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      const { confirmPassword, ...signupData } = credentials
      await signupMutation.mutateAsync(signupData)
      onSuccess?.()
    } catch (error) {
      // Error is handled by the useSignup hook
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
    <div className="signup-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
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

        {signupMutation.isError && (
          <div className="error-message">
            {signupMutation.error?.message || 'Signup failed'}
          </div>
        )}

        <button 
          type="submit" 
          disabled={signupMutation.isPending}
          className="submit-button"
        >
          {signupMutation.isPending ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  )
}
