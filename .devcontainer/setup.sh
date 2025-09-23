#!/bin/bash
# Create .env file template for MovieApp if it doesn't exist

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file template..."
    cat > .env << EOL
# TMDB API Configuration
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3

# Supabase Configuration  
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
EOL
    echo "⚠️  Please update .env with your actual API keys!"
else
    echo "✅ .env file already exists"
fi