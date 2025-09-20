import React from 'react'
import { Search } from 'lucide-react'
import { Input } from './ui/input'
import { useHomeContext } from '../contexts/HomeContext'

export const Hero: React.FC = () => {
  const { searchQuery, setSearchQuery } = useHomeContext()

  return (
    <section className="relative h-[60vh] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXIlMjBjaW5lbWF8ZW58MXx8fHwxNzU4MDIzMTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
          Unlimited movies, TV shows, and more
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-8">
          Watch anywhere. Cancel anytime.
        </p>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search movies, shows, actors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-gray-600 text-white placeholder-gray-400 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>
    </section>
  )
}