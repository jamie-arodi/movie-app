import { createContext } from 'react'
import type { HomeContextType } from '../types/home'

export const HomeContext = createContext<HomeContextType | undefined>(undefined)