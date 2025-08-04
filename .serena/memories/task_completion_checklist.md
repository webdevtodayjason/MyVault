# Task Completion Checklist

When completing any coding task in this project, follow these steps:

## 1. Code Quality Checks
```bash
# Run linting to check for code issues
npm run lint

# Build the project to check for TypeScript errors
npm run build
```

## 2. Manual Testing
- Start the development server: `npm run dev`
- Test the implemented feature thoroughly:
  - Check all CRUD operations if applicable
  - Test edge cases and error handling
  - Verify UI responsiveness on different screen sizes
  - Ensure data persistence (refresh browser)
  - Check browser console for errors

## 3. Component Integration
- **IMPORTANT**: If you added new pages or major components, ensure they are:
  - Added to routes in `/src/App.tsx`
  - Imported and used in the main page `/src/pages/Index.tsx` if needed
  - Otherwise the user cannot see the new components!

## 4. Pre-Commit Verification
- Ensure no TypeScript errors: `npm run build`
- Check for linting issues: `npm run lint`
- Test production build locally: `npm run build && npm run preview`
- Verify all imports use the `@/` alias where appropriate

## 5. Common Issues to Check
- [ ] All shadcn/ui components imported from `@/components/ui/`
- [ ] Tailwind classes used for all styling (no inline styles)
- [ ] Toast notifications added for user actions
- [ ] Loading states implemented for async operations
- [ ] Error handling with try-catch blocks
- [ ] Responsive design works on mobile

## 6. Final Steps
- Review changed files for any console.log statements to remove
- Ensure no sensitive data or API keys are hardcoded
- Verify the feature works after a full page refresh
- Test export/import functionality if data models were changed

## Note on Testing
This project does not have automated tests configured. All testing must be done manually through the development server. Consider adding tests for critical functionality in the future.