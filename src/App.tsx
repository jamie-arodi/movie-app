import { useAuthStore } from './store/authStore'
import { Login } from './components/Login'
import { Signup } from './components/Signup'
import { Home } from './components/Home'


function App() {
  const { 
    currentView, 
    isAuthenticated, 
  } = useAuthStore()

  if (isAuthenticated) {
    return <Home />
  }

  if (currentView === 'signup') {
    return <Signup />
  }

  return <Login />
}

export default App
