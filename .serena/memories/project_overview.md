# AI & API Manager Project Overview

## Purpose
A comprehensive web application for managing AI applications, API keys, and bookmarks. The app provides a secure, client-side solution for developers to organize their AI tools and resources.

## Key Features
- **AI Applications Management**: Track and organize AI applications with descriptions, URLs, and API key associations
- **API Keys Management**: Securely store and manage API keys with visibility controls and activity tracking
- **Bookmarks Management**: Organize useful links with tags and search functionality
- **Local Storage**: All data stored locally using IndexedDB - no server required
- **Modern UI**: Beautiful dark theme interface with responsive design
- **Export/Import**: Backup and restore data with JSON export/import functionality

## Tech Stack
- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: IndexedDB (client-side storage using idb library)
- **Routing**: React Router DOM
- **State Management**: React hooks (useState, useEffect)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Form Handling**: React Hook Form with Zod validation
- **Query Management**: @tanstack/react-query

## Development Environment
- **Node Version**: >=18.0.0 (specified in .nvmrc and package.json)
- **Package Manager**: npm (lock file present)
- **TypeScript**: Version 5.5.3

## Deployment
- Optimized for Railway deployment with nixpacks.toml and railway.json configuration
- Static file serving with Vite preview for production
- Automatic port detection using $PORT environment variable