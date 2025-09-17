import { useAuthStore } from './store/authStore'
import { useLogout } from './hooks/useAuth'
import { Login } from './components/Login'
import { Signup } from './components/Signup'
import { useState } from 'react'


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
      <div className="w-full min-h-screen bg-gray-100">
        <div className="max-w-5xl mx-auto px-8 py-8 text-center">
          <header className="bg-gray-800 p-5 text-white mb-8 rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Movie App</h1>
            
            {!isAuthenticated ? (
              <nav className="flex gap-4 justify-center items-center">
                <button 
                  onClick={() => setCurrentView('login')}
                  className="bg-cyan-400 text-gray-800 border-none px-4 py-2 rounded cursor-pointer font-bold hover:bg-cyan-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Login
                </button>
                <button 
                  onClick={() => setCurrentView('signup')}
                  className="bg-cyan-400 text-gray-800 border-none px-4 py-2 rounded cursor-pointer font-bold hover:bg-cyan-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Sign Up
                </button>
              </nav>
            ) : (
              <nav className="flex gap-4 justify-center items-center">
                <span>Welcome back, {user?.user_metadata?.firstName || user?.email}!</span>
                <button 
                  onClick={handleLogoutClick}
                  disabled={logoutMutation.isPending}
                  className="bg-cyan-400 text-gray-800 border-none px-4 py-2 rounded cursor-pointer font-bold hover:bg-cyan-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                </button>
              </nav>
            )}
          </header>

        {logoutError && (
          <div className="text-red-600 bg-red-100 border border-red-300 px-3 py-2 rounded my-4">
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
              <h2 className="text-xl font-semibold mb-4">Welcome to your Movie App{user?.user_metadata?.firstName ? `, ${user.user_metadata.firstName}` : ''}!</h2>
              <p className="mb-6">You are now logged in and can browse movies.</p>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mt-8 max-w-lg mx-auto">
                <h3 className="mt-0 text-gray-700 font-semibold mb-4">User Information:</h3>
                <p className="my-2 text-left"><strong>Email:</strong> {user?.email}</p>
                <p className="my-2 text-left"><strong>Role:</strong> {user?.role}</p>
                <p className="my-2 text-left"><strong>ID:</strong> {user?.id}</p>
                {user?.user_metadata?.firstName && (
                  <p className="my-2 text-left"><strong>First Name:</strong> {user.user_metadata.firstName}</p>
                )}
                {user?.user_metadata?.lastName && (
                  <p className="my-2 text-left"><strong>Last Name:</strong> {user.user_metadata.lastName}</p>
                )}
                {user?.user_metadata?.name && (
                  <p className="my-2 text-left"><strong>Full Name:</strong> {user.user_metadata.name}</p>
                )}
              </div>
            </div>
          )}
          
          {currentView === 'home' && !isAuthenticated && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Welcome to Movie App</h2>
              <p>Please log in or sign up to get started.</p>
            </div>
          )}
        </main>
        </div>
      </div>
  )
}

export default App
