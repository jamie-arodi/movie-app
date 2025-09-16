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
    <div className="login-form">
      <h2>Login</h2>
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
            disabled={loginMutation.isPending}
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
            disabled={loginMutation.isPending}
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
            disabled={loginMutation.isPending}
            className="submit-button"
          >
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </button>
          
          <button 
            type="button"
            onClick={handleBackToHome}
            className="secondary-button"
            disabled={loginMutation.isPending}
          >
            Back to Home
          </button>
        </div>
      </form>
    </div>
  )
}
