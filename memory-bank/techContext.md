# Technical Context: Company Management System

## Technology Stack
- **Frontend Framework**: Next.js 15.4.6 with App Router
- **Runtime**: React 19.1.0 with React DOM 19.1.0
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4 with PostCSS
- **UI Components**: shadcn/ui + Radix UI primitives
- **Package Manager**: pnpm
- **Development Server**: Turbopack for fast builds

## Development Setup
- **Node.js**: Version 20+ required
- **Package Manager**: pnpm (preferred) or npm
- **Development Commands**:
  - `pnpm dev` - Start development server with Turbopack
  - `pnpm build` - Production build
  - `pnpm start` - Start production server
  - `pnpm lint` - Run ESLint

## Technical Constraints
- **Browser Support**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- **Performance**: Page load <2 seconds, search <500ms
- **Accessibility**: WCAG 2.1 AA compliance
- **Mobile**: Responsive design for all breakpoints
- **Security**: Admin-only access, input validation, CSRF protection

## Dependencies
### Core Dependencies
- `next`: 15.4.6 - React framework
- `react`: 19.1.0 - UI library
- `react-dom`: 19.1.0 - DOM rendering
- `typescript`: 5 - Type safety

### UI Dependencies
- `@radix-ui/react-slot`: 1.2.3 - Component primitives
- `class-variance-authority`: 0.7.1 - Component variants
- `clsx`: 2.1.1 - Conditional classes
- `lucide-react`: 0.541.0 - Icon library
- `tailwind-merge`: 3.3.1 - Tailwind class merging

### Development Dependencies
- `@eslint/eslintrc`: 3 - ESLint configuration
- `@tailwindcss/postcss`: 4 - TailwindCSS PostCSS plugin
- `@types/node`: 20 - Node.js types
- `@types/react`: 19 - React types
- `@types/react-dom`: 19 - React DOM types
- `eslint`: 9 - Code linting
- `eslint-config-next`: 15.4.6 - Next.js ESLint config
- `tailwindcss`: 4 - CSS framework

## Configuration Files
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint configuration
- `postcss.config.mjs` - PostCSS configuration
- `tailwind.config.js` - TailwindCSS configuration

## Build & Deployment
- **Build Tool**: Next.js built-in bundler
- **Output**: Static files + server components
- **Deployment**: Vercel (recommended) or any Node.js hosting
- **Environment**: Node.js 20+ runtime

## Development Tools
- **Code Quality**: ESLint with Next.js config
- **Type Checking**: TypeScript strict mode
- **Hot Reload**: Turbopack for fast development
- **Package Management**: pnpm for efficient dependency management
