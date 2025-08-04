# Suggested Commands

## Development Commands
```bash
# Start development server (port 8080)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Start production server (Railway deployment)
npm start
```

## Code Quality Commands
```bash
# Run ESLint linting
npm run lint

# TypeScript type checking (part of build)
npm run build
```

## Testing Workflow
```bash
# No test command configured in package.json
# Manual testing recommended:
1. Run development server: npm run dev
2. Test all CRUD operations for AI apps, API keys, and bookmarks
3. Test search and filtering functionality
4. Test export/import functionality
5. Verify data persistence after browser refresh
```

## Git Commands
```bash
# Check status
git status

# Stage changes
git add .

# Commit changes (without co-author tag)
git commit -m "Your message"

# Push to remote
git push origin main
```

## System Utilities (macOS/Darwin)
```bash
# List files
ls -la

# Find files
find . -name "*.tsx"

# Search in files (use ripgrep)
rg "search_term"

# Navigate directories
cd directory_name

# Create directory
mkdir directory_name
```

## Deployment Commands
```bash
# Build and test before deployment
npm run build && npm run preview

# Push to GitHub (triggers Railway auto-deploy)
git push origin main
```

## Package Management
```bash
# Install dependencies
npm install

# Install specific package
npm install package-name

# Install dev dependency
npm install -D package-name

# Update dependencies
npm update
```