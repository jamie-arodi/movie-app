import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from './store/authStore'
import { useLogout } from './hooks/useAuth'
import { Login } from './components/Login'
import { Signup } from './components/Signup'
import { useState } from 'react'
import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
})

function App() {
  const { 
    currentView, 
    setCurrentView, 
    isAuthenticated, 
    user 
  } = useAuthStore()
  
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
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <header className="App-header">
          <h1>Movie App</h1>
          
          {!isAuthenticated ? (
            <nav>
              <button onClick={() => setCurrentView('login')}>Login</button>
              <button onClick={() => setCurrentView('signup')}>Sign Up</button>
            </nav>
          ) : (
            <nav>
              <span>Welcome back, {user?.email}!</span>
              <button 
                onClick={handleLogoutClick}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
              </button>
            </nav>
          )}
        </header>

        {logoutError && (
          <div className="error-message">
            {logoutError}
          </div>
        )}

        <main>
          {currentView === 'login' && (
            <Login />
          )}
          
          {currentView === 'signup' && (
            <Signup />
          )}
          
          {currentView === 'home' && isAuthenticated && (
            <div>
              <h2>Welcome to your Movie App!</h2>
              <p>You are now logged in and can browse movies.</p>
              <div className="user-info">
                <h3>User Information:</h3>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
                <p><strong>ID:</strong> {user?.id}</p>
                {user?.user_metadata?.name && (
                  <p><strong>Name:</strong> {user.user_metadata.name}</p>
                )}
              </div>
            </div>
          )}
          
          {currentView === 'home' && !isAuthenticated && (
            <div>
              <h2>Welcome to Movie App</h2>
              <p>Please log in or sign up to get started.</p>
            </div>
          )}
        </main>
      </div>
    </QueryClientProvider>
  )
}

export default App
