import { useContext } from 'react'
import { HomeContext } from '../contexts/HomeContextDefinition'

export const useHomeContext = () => {
  const context = useContext(HomeContext)
  if (!context) {
    throw new Error('useHomeContext must be used within a HomeProvider')
  }
  return context
}