import React, { useState } from 'react'
import { useLogin } from '../hooks/useAuth'
import type { LoginCredentials } from '../types/auth'

interface LoginProps {
  onSuccess?: () => void
}

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  })

  const loginMutation = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await loginMutation.mutateAsync(credentials)
      onSuccess?.()
    } catch (error) {
      // Error is handled by the useLogin hook
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

        {loginMutation.isError && (
          <div className="error-message">
            {loginMutation.error?.message || 'Login failed'}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loginMutation.isPending}
          className="submit-button"
        >
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
