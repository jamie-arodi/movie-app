# Dev Container Setup

This project includes a dev container configuration for consistent development environments across all platforms.

## Quick Start

### Using VS Code

1. **Install the Dev Containers extension**:
   - [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

2. **Open the project**:
   - Open this repository in VS Code
   - When prompted, click "Reopen in Container"
   - Or press `F1` and select "Dev Containers: Reopen in Container"

### Using GitHub Codespaces

1. Click the "Code" button on this repository
2. Select "Codespaces" tab  
3. Click "Create codespace on main"

## What's Included

### Base Environment
- **Node.js 20** with npm and latest features
- **Git** and **GitHub CLI** for version control
- **Docker-in-Docker** for containerized workflows
- **VS Code** with essential extensions pre-installed

### Pre-installed VS Code Extensions
- **Tailwind CSS IntelliSense** - Auto-completion and syntax highlighting
- **TypeScript and JavaScript** - Enhanced language support
- **Prettier** - Code formatting
- **ESLint** - Code linting and error detection
- **Vitest Explorer** - Test runner integration
- **Error Lens** - Inline error highlighting
- **Auto Rename Tag** - HTML/JSX tag synchronization
- **Path Intellisense** - File path auto-completion
- **Thunder Client** - API testing tool

### Port Forwarding
- **Port 5173**: Vite development server
- **Port 5174**: Vite preview server
- Automatic port forwarding with notifications

### Automatic Setup
- Dependencies automatically installed via `npm install`
- Environment configured for immediate development
- Performance optimizations with volume mounts

## Usage

Once the container is running:

```bash
# Start development server
npm run dev

# Run tests  
npm run test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run type-check
```

## Environment Variables

Set up your environment variables for API access:

1. The setup script creates a `.env` template automatically
2. Update `.env` with your actual credentials:
   ```env
   # TMDB API Configuration
   VITE_TMDB_API_KEY=your_actual_api_key
   VITE_TMDB_BASE_URL=https://api.themoviedb.org/3

   # Supabase Configuration  
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Restart the dev server: `npm run dev`

## Development Features

### Hot Module Replacement (HMR)
- Instant updates as you edit React components
- State preservation during development
- Fast refresh for optimal development experience

### Testing
- **Vitest** for unit and integration tests
- **Testing Library** for component testing
- Test explorer integration in VS Code
- Coverage reporting available

### Code Quality
- **ESLint** with React and TypeScript rules
- **Prettier** for consistent formatting
- **TypeScript** for type safety
- Automatic formatting on save

## Performance Tips

### Container Performance
- Volume mounts for `node_modules` improve performance
- File watching works automatically with Vite's HMR
- Use the integrated VS Code terminal for best experience

### Development Workflow
- Keep the container running between sessions
- Use `npm run dev` for active development
- Use `npm run preview` to test production builds

## Troubleshooting

### Container Issues

**Container won't start:**
```bash
# Rebuild the container
F1 → "Dev Containers: Rebuild Container"

# Or rebuild without cache
F1 → "Dev Containers: Rebuild Container Without Cache"
```

**Docker issues:**
- Ensure Docker Desktop is running
- Check Docker has enough resources allocated (4GB+ RAM recommended)
- Restart Docker if experiencing issues

### Port Conflicts

**Ports already in use:**
- Check if ports 5173/5174 are occupied: `lsof -i :5173`
- Stop other Vite processes or change ports in `vite.config.ts`
- The container will automatically forward available ports

### Performance Issues

**Slow file operations:**
- Ensure volume mounts are working (check `.devcontainer/devcontainer.json`)
- Consider increasing Docker Desktop resource limits
- Use `npm run dev` instead of `npm start` for development

### Environment Variables

**API calls failing:**
- Verify `.env` file exists and has correct values
- Check environment variables are loaded: `console.log(import.meta.env)`
- Restart dev server after changing `.env`: `npm run dev`

## Advanced Configuration

### Custom Extensions
Add more extensions in `.devcontainer/devcontainer.json`:
```json
"extensions": [
  "your.extension.id"
]
```

### Additional Features
Enable more dev container features:
```json
"features": {
  "ghcr.io/devcontainers/features/docker-compose:2": {}
}
```

### Environment Customization
Modify container environment in `devcontainer.json`:
```json
"containerEnv": {
  "CUSTOM_VAR": "value"
}
```

## Support

- **Dev Container Docs**: [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)
- **GitHub Codespaces**: [Codespaces Documentation](https://docs.github.com/en/codespaces)
- **Project Issues**: Open an issue in this repository

---

🎬 **Happy coding with MovieApp!** The dev container provides everything you need to start contributing immediately.