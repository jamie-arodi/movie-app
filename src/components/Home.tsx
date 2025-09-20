import React from 'react'
import { HomeProvider } from '../contexts/HomeContext'
import { TopNav } from './TopNav'
import { Hero } from './Hero'
import { MovieGrid } from './MovieGrid'
import { MovieModal } from './MovieModal'
import { Footer } from './Footer'

export const Home: React.FC = () => {
  return (
    <HomeProvider>
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <TopNav />
        <Hero />
        <MovieGrid />
        <Footer />
        <MovieModal />
      </div>
    </HomeProvider>
  )
}
