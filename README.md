# 🎬 MovieApp

<img width="2032" height="1283" alt="Screenshot 2025-09-20 at 11 35 05" src="https://github.com/user-attachments/assets/125f4a14-4176-4f7f-bc5a-64fdff357b24" />

A modern, full-featured movie discovery application built with React 19, TypeScript, and The Movie Database (TMDB) API. Features user authentication, movie search, pagination, and a clean, responsive design.

![React](https://img.shields.io/badge/React-19.1.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue.svg)
![Vite](https://img.shields.io/badge/Vite-7.1.5-purple.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.13-teal.svg)

## ✨ Features

- 🔐 **User Authentication** - Secure login/signup with Supabase
- 🎭 **Movie Discovery** - Browse popular movies with rich details
- 🔍 **Smart Search** - Debounced search with real-time results
- 📱 **Responsive Design** - Mobile-first, works on all devices
- 🚀 **Performance Optimized** - API caching, lazy loading, and optimized builds
- ♾️ **Infinite Scroll** - Load more movies with pagination
- 🎨 **Modern UI** - Clean design with Tailwind CSS and Lucide icons
- 🧪 **Fully Tested** - Comprehensive test suite with Vitest
- 🔄 **State Management** - Zustand for auth, React Query for server state

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 20.19+ or 22.12+)
- **npm** or **yarn**
- **TMDB API Key** - [Get yours here](https://www.themoviedb.org/settings/api)
- **Supabase Project** - [Create one here](https://supabase.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/arodidev/movie-app.git
   cd movie-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` with your API keys:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:5173` to see the app in action! 🎉

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Footer.tsx      # App footer
│   ├── Hero.tsx        # Hero section with search
│   ├── Home.tsx        # Main home page
│   ├── Login.tsx       # Login form
│   ├── MovieGrid.tsx   # Movie grid with pagination
│   ├── MovieModal.tsx  # Movie details modal
│   ├── Signup.tsx      # Signup form
│   └── TopNav.tsx      # Navigation header
├── contexts/           # React Context providers
│   ├── HomeContext.tsx        # Home page state management
│   └── HomeContextDefinition.ts # Context definition
├── hooks/              # Custom React hooks
│   ├── useAuth.ts         # Authentication hooks
│   ├── useAutoScroll.ts   # Auto-scroll functionality
│   ├── useDebounce.ts     # Debouncing utility
│   ├── useHomeContext.ts  # Home context hook
│   ├── useMovies.ts       # Movie data fetching
│   ├── useMoviesPagination.ts # Pagination logic
│   ├── useSearchMovies.ts # Movie search
│   └── useSearchReset.ts  # Search reset logic
├── services/           # API clients
│   ├── auth-http-client.ts   # Supabase authentication
│   └── movie-http-client.ts  # TMDB API client
├── store/              # Global state management
│   └── authStore.ts    # Zustand auth store
├── types/              # TypeScript type definitions
│   ├── auth.ts         # Authentication types
│   ├── home.ts         # Home page types
│   └── movie.ts        # Movie data types
├── utils/              # Utility functions
├── tests/              # Test files
│   ├── mocks/          # Test mocks
│   └── *.test.ts       # Unit and integration tests
└── App.tsx             # Main app component
```

## 🛠️ Tech Stack

### Core Technologies
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[Class Variance Authority](https://cva.style/)** - Component variants

### State Management
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[TanStack Query](https://tanstack.com/query)** - Server state management

### API & Backend
- **[TMDB API](https://www.themoviedb.org/documentation/api)** - Movie database
- **[Supabase](https://supabase.com/)** - Authentication and backend

### Testing
- **[Vitest](https://vitest.dev/)** - Fast unit test framework
- **[Testing Library](https://testing-library.com/)** - Component testing utilities
- **[jsdom](https://github.com/jsdom/jsdom)** - DOM simulation

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[PostCSS](https://postcss.org/)** - CSS processing

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Run with coverage
npm run test:coverage
```

## 📦 Building

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 🏗️ Architecture Highlights

### Component Architecture
- **Modular Design** - Each component has a single responsibility
- **Context Pattern** - Eliminates prop drilling with React Context
- **Custom Hooks** - Reusable logic extracted into focused hooks
- **Fast Refresh Compliant** - Proper separation for optimal DX

### Performance Optimizations
- **API Caching** - 5-minute cache for movie data
- **Debounced Search** - 500ms debounce for search queries
- **Lazy Loading** - Components and routes loaded on demand
- **Optimistic Updates** - Immediate UI feedback

### Code Quality
- **TypeScript** - Full type safety throughout the application
- **ESLint** - Consistent code style and best practices
- **Component Testing** - Critical paths covered with tests
- **Error Boundaries** - Graceful error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[The Movie Database (TMDB)](https://www.themoviedb.org/)** - Movie data and images
- **[Supabase](https://supabase.com/)** - Backend and authentication
- **[Vercel](https://vercel.com/)** - Deployment platform

---

Built with ❤️ by [arodidev](https://github.com/arodidev)
src/
├── App.tsx        # Main App component
├── App.css        # App styles
├── main.tsx       # Application entry point
└── index.css      # Global styles
```
```
