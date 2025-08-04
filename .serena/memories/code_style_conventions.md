# Code Style and Conventions

## TypeScript Configuration
- **Relaxed TypeScript Rules**:
  - `noImplicitAny: false` - Allows implicit any types
  - `noUnusedParameters: false` - Allows unused parameters
  - `noUnusedLocals: false` - Allows unused local variables
  - `strictNullChecks: false` - Nullable types not strictly checked
  - `skipLibCheck: true` - Skip type checking of declaration files
  - `allowJs: true` - JavaScript files allowed

## Path Aliases
- Use `@/*` for imports from src directory
- Example: `import { Button } from "@/components/ui/button"`

## File Structure Conventions
- **Pages**: `/src/pages/` (PascalCase, e.g., Dashboard.tsx, Index.tsx)
- **Components**: `/src/components/` (kebab-case for files, e.g., alert-dialog.tsx)
- **UI Components**: `/src/components/ui/` (shadcn/ui components)
- **Hooks**: `/src/hooks/` (camelCase with 'use' prefix, e.g., useDatabase.ts)
- **Utils**: `/src/lib/` and `/src/utils/` for utility functions

## React Component Patterns
- **Functional Components**: All components use arrow functions or function declarations
- **Export Pattern**: Named exports for most components, default export for pages
- **forwardRef Pattern**: Used extensively in UI components for ref forwarding
- **Component Composition**: UI components often composed of multiple sub-components

## Styling Conventions
- **Tailwind CSS First**: All styling done with Tailwind utility classes
- **Class Variance Authority (CVA)**: Used for component variants
- **cn() Utility**: Used for conditional class names (from lib/utils)
- **Dark Mode**: Dark theme as default, using zinc color palette

## State Management
- **React Hooks**: useState, useEffect for local state
- **Custom Hooks**: Abstract complex logic (useDatabase, useToast, useIsMobile)
- **Context Pattern**: Used in complex components (sidebar, form, carousel)

## Import Order (typical pattern)
1. React and React-related imports
2. Third-party libraries
3. UI components (@/components/ui/*)
4. Local components
5. Hooks
6. Utils and lib functions
7. Types and interfaces

## Naming Conventions
- **Components**: PascalCase (e.g., AlertDialog, Dashboard)
- **Functions/Hooks**: camelCase (e.g., handleAddApp, useDatabase)
- **Constants**: UPPER_SNAKE_CASE for global constants (e.g., DB_NAME, TOAST_LIMIT)
- **Types/Interfaces**: PascalCase (e.g., ApiKey, App, Bookmark)

## ESLint Rules
- React Hooks rules enforced
- React Refresh for HMR
- @typescript-eslint/no-unused-vars disabled
- Only export components warning for React Refresh

## Best Practices Observed
- Memoization where needed
- Proper cleanup in useEffect
- Error handling with try-catch blocks
- Toast notifications for user feedback
- Loading states for async operations
- Responsive design with mobile-first approach