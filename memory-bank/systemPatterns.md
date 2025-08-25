# System Patterns: Company Management System

## Architecture Overview
Next.js 15 App Router with hybrid rendering strategy - Server Components for static content, Client Components for interactivity.

## Key Technical Decisions
- **App Router**: Modern Next.js routing with file-based structure
- **Server-First**: Server Components by default, Client Components only when needed
- **TypeScript**: Strict typing for better developer experience and runtime safety
- **TailwindCSS**: Utility-first CSS framework for consistent styling
- **shadcn/ui**: Component library built on Radix UI primitives

## Design Patterns in Use
- **Component Composition**: Building complex UIs from simple, reusable components
- **Server Actions**: Form handling and mutations on the server
- **API Routes**: RESTful endpoints for data operations
- **Error Boundaries**: Graceful error handling at component level
- **Loading States**: Suspense boundaries for better UX

## Component Relationships
```
Layout (Server)
├── Navigation (Server)
├── Page Content (Server/Client)
│   ├── Header (Server)
│   ├── Main Content (Client)
│   └── Footer (Server)
└── Error Boundary (Client)
```

## Data Flow Patterns
1. **Server-Side Rendering**: Initial page load with server-fetched data
2. **Client-Side Updates**: Interactive features with optimistic updates
3. **API Integration**: RESTful endpoints for CRUD operations
4. **State Management**: Local state with React hooks, global state if needed

## File Structure Patterns
```
app/
├── layout.tsx          # Root layout
├── page.tsx           # Home page
├── companies/         # Feature route group
│   ├── page.tsx      # Companies listing
│   ├── [id]/         # Dynamic company route
│   └── create/       # Company creation
└── api/              # API routes
    └── admin/
        └── company/  # Company API endpoints

components/
├── ui/               # shadcn/ui components
├── companies/        # Feature-specific components
└── layouts/          # Layout components

utils/
├── index.ts          # Utility functions
├── validations.ts    # Zod schemas
└── api.ts           # API client functions
```

## State Management Strategy
- **Local State**: useState/useReducer for component-specific state
- **Form State**: React Hook Form with Zod validation
- **Server State**: TanStack Query for API data management
- **Global State**: Zustand for cross-component state (if needed)

## Performance Patterns
- **Code Splitting**: Dynamic imports for heavy components
- **Image Optimization**: Next.js Image component with lazy loading
- **Caching**: Next.js built-in caching strategies
- **Bundle Optimization**: Tree shaking and dead code elimination
