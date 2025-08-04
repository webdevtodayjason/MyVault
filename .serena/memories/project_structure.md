# Project Structure

## Root Directory Files
- `package.json` - Node.js dependencies and scripts
- `tsconfig.json` - TypeScript configuration (references app and node configs)
- `tsconfig.app.json` - TypeScript config for application code
- `tsconfig.node.json` - TypeScript config for Node.js/Vite files
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `components.json` - shadcn/ui components configuration
- `postcss.config.js` - PostCSS configuration for Tailwind
- `eslint.config.js` - ESLint configuration
- `.nvmrc` - Node version specification (18)
- `AI_RULES.md` - AI assistant guidelines for development

## Deployment Configuration
- `railway.json` - Railway deployment configuration
- `nixpacks.toml` - Nixpacks build configuration for Railway

## Source Code Structure (`/src`)
```
src/
├── App.tsx              # Main app component with routing
├── main.tsx            # Application entry point
├── globals.css         # Global styles and Tailwind imports
├── vite-env.d.ts      # Vite type definitions
│
├── components/         # React components
│   ├── ui/            # shadcn/ui components (50+ files)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── ... (many more UI components)
│   └── made-with-dyad.tsx  # Custom branding component
│
├── pages/             # Page components
│   ├── Index.tsx     # Landing/home page
│   ├── Dashboard.tsx # Main dashboard with tabs
│   └── NotFound.tsx  # 404 error page
│
├── hooks/            # Custom React hooks
│   ├── useDatabase.ts   # Database operations hook
│   ├── use-toast.ts     # Toast notifications hook
│   └── use-mobile.tsx   # Mobile detection hook
│
├── lib/              # Core libraries
│   ├── database.ts   # IndexedDB operations
│   └── utils.ts      # Utility functions (cn helper)
│
└── utils/            # Additional utilities
    └── toast.ts      # Toast notification helpers
```

## Key Application Files

### Core Application
- `App.tsx` - Defines routes: /, /dashboard, /* (404)
- `main.tsx` - Sets up React Query and renders app

### Database Layer
- `lib/database.ts` - IndexedDB schema and CRUD operations for:
  - Apps (AI applications)
  - ApiKeys (API key storage)
  - Bookmarks (link management)

### Main Features
- `pages/Dashboard.tsx` - Main interface with three tabs:
  - AI Applications tab
  - API Keys tab
  - Bookmarks tab
  - Includes search, filter, add, edit, delete, export/import

### UI Components
- 50+ shadcn/ui components pre-installed
- All follow consistent patterns with forwardRef
- Use Tailwind CSS for styling
- Dark theme by default

## Data Flow
1. User interacts with Dashboard UI
2. Dashboard uses `useDatabase` hook
3. Hook calls functions from `lib/database.ts`
4. Database operations use IndexedDB via `idb` library
5. Data persists locally in browser storage