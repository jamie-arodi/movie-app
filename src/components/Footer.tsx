import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-800 bg-gray-900/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Brand */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-red-500 mb-4">MovieApp</h3>
          <p className="text-gray-400 text-sm mb-8">
            Discover and explore the latest movies and timeless classics.
          </p>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 MovieApp. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 sm:mt-0">
            Powered by The Movie Database (TMDB)
          </p>
        </div>
      </div>
    </footer>
  )
}