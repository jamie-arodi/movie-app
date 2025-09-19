import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '../types/auth'
import { isTokenExpired as checkTokenExpired } from '../utils/auth'

export type ViewType = 'login' | 'signup' | 'home'

interface AuthState {
  currentView: ViewType
  setCurrentView: (view: ViewType) => void
  
  isAuthenticated: boolean
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
  
  setAuthenticatedUser: (user: AuthUser, accessToken: string, refreshToken: string, expiresAt: number) => void
  clearAuthentication: () => void
  updateUser: (user: Partial<AuthUser>) => void
  
  setTokens: (accessToken: string, refreshToken: string) => void
  clearTokens: () => void
  
  isTokenExpired: () => boolean
  
  reset: () => void
}

const initialState = {
  currentView: 'login' as ViewType,
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setCurrentView: (view: ViewType) => {
        set({ currentView: view })
      },
      
      setAuthenticatedUser: (user: AuthUser, accessToken: string, refreshToken: string, expiresAt: number) => {
        set({
          isAuthenticated: true,
          user,
          accessToken,
          refreshToken,
          expiresAt,
          currentView: 'home',
        })
      },
      
      clearAuthentication: () => {
        set({
          ...initialState,
          currentView: 'login',
        })
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      },
      
      updateUser: (userUpdate: Partial<AuthUser>) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...userUpdate }
          })
        }
      },
      
      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken })
      },
      
      clearTokens: () => {
        set({ accessToken: null, refreshToken: null })
      },
      
      isTokenExpired: () => {
        const { expiresAt } = get()
        return checkTokenExpired(expiresAt)
      },
      
      reset: () => {
        set(initialState)
      },
    }),
    {
      name: 'movie-app-storage',
      partialize: (state: AuthState) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
      }),
    }
  )
)
