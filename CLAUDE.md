# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**monitorias-uvv** is a web-based tutoring monitoring system for UVV (Universidade Vila Velha). It's a React + TypeScript application with role-based access control for three user types: students (aluno), tutors (monitor), and coordinators (coordenador).

## Tech Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 7.3.2 (with @vitejs/plugin-react-swc for fast compilation)
- **Routing**: React Router v6.30.1 (nested routes by role)
- **Backend/Database**: Supabase (PostgreSQL + Auth)
- **Data Fetching**: TanStack React Query v5.83.0
- **UI Components**: shadcn/ui (Radix UI primitives) + Lucide icons
- **Styling**: Tailwind CSS 3.4.17 with custom animations
- **Forms**: React Hook Form v7.61.1 + Zod v3.25.76 for validation
- **State Management**: React Context API (AuthContext) + local state
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint with TypeScript support

## Commands

### Development
- `npm run dev` - Start Vite dev server on http://localhost:8080
- `npm run build` - Build for production (vite build)
- `npm run build:dev` - Build in development mode (useful for debugging builds)
- `npm run preview` - Preview production build locally

### Testing & Quality
- `npm test` or `npm run test` - Run tests once (Vitest)
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint across the codebase

## Architecture

### Authentication & Authorization

- **AuthContext** (`src/contexts/AuthContext.tsx`) is the single source of truth for user state
- Session is hydrated on app load via `supabase.auth.getSession()`
- User data is fetched from `usuarios` table (separate from Supabase Auth)
- Three roles: `"aluno"`, `"monitor"`, `"coordenador"` determine accessible routes
- ProtectedRoute wrapper in App.tsx prevents unauthenticated access
- Automatic role-based redirects on login (e.g., `/monitor` for tutors)

### Routing Structure

```
/login                     - Auth page
/cadastro                  - Registration (students only)
/aluno/*                   - Student dashboard
  /                        - Stats & upcoming tutoring
  /buscar                  - Search/browse tutoring
  /agendamentos            - My bookings
/monitor/*                 - Tutor dashboard
  /                        - Tutor overview
  /monitorias              - Manage tutoring sessions
  /presencas               - Attendance tracking
/coordenador/*             - Coordinator dashboard
  /                        - Coordinator overview
  /relatorios              - Reports
  /monitores               - Manage tutors
```

Routes are nested under `DashboardLayout`, which handles responsive UI (sidebar on desktop, bottom tab bar on mobile).

### Data Flow

1. **Page components** (`src/pages/{role}/{RolePage}.tsx`) make direct Supabase queries using `.select()`, `.eq()`, `.order()` chains
2. **Supabase client** is initialized in `src/lib/supabase.ts` with env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. **React Query** (TanStack Query) can wrap queries for caching, but currently pages use raw Supabase calls
4. **UI Context** (`TooltipProvider`, `Toaster` for sonner + shadcn toaster) wraps the app for notifications

### Database Schema (Inferred)

Key tables used throughout:
- `usuarios` (id, nome, email, matricula, role)
- `monitorias` (id, data_hora_inicio, local, disciplinas_id, monitor_id, status)
- `disciplinas` (id, nome)
- `inscricoes` (id, aluno_id, monitoria_id, status)
- `avaliacoes` (id, aluno_id, monitoria_id, nota, comentario)
- `presencas` (id, inscricao_id, monitoria_id, presente)
- `relatorios` (id, monitoria_id, conteudo, data)

### Component Organization

- `src/components/` - Reusable UI building blocks
  - `ui/` - shadcn primitives (button, card, input, dialog, etc.)
  - `DashboardLayout.tsx` - Responsive layout wrapper (sidebar + outlet)
  - `AppSidebar.tsx` - Navigation sidebar with role-based links
  - `MobileTabBar.tsx` - Bottom navigation for mobile
  - Specialized: `MonitoriaCard`, `StatusBadge`, etc.

- `src/pages/` - Route-level components (one per page)
  - Organized by role: `aluno/`, `monitor/`, `coordenador/`
  - Each page fetches its own data on mount with `useEffect`

- `src/hooks/` - Custom React hooks
  - `useIsMobile()` - Responsive breakpoint hook (768px threshold)
  - `useToast()` - shadcn toast hook

- `src/contexts/` - React Context providers
  - `AuthContext.tsx` - Global auth state and login/logout

- `src/types/` - TypeScript interfaces
  - `models.ts` - All domain models (Usuario, Monitoria, etc.)

- `src/lib/` - Utility functions and clients
  - `supabase.ts` - Supabase client initialization
  - `utils.ts` - Helper functions (e.g., `cn()` for class merging)

### Key Architectural Decisions

1. **Minimal State Management**: Uses React Context + local useState instead of Redux/Zustand. Simple enough for current scope.
2. **Direct Supabase Queries in Pages**: No abstraction layer or service functions. Each page imports supabase directly. Acceptable for small app, but consider extracting to hooks or services as complexity grows.
3. **Responsive Design**: Single DashboardLayout with conditional rendering (useIsMobile hook) handles both desktop sidebar and mobile bottom nav.
4. **Tailwind + shadcn**: Leverages pre-built accessible components from Radix UI, reducing boilerplate.
5. **TypeScript but Lenient**: `tsconfig.json` has `noImplicitAny: false`, `strictNullChecks: false`, `strict: false` — flexibility over strict typing.

## Environment Setup

- `.env.local` contains `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- These are Vite environment variables (prefix `VITE_` is required)
- Current env points to a real Supabase project

## Testing Setup

- Vitest configured in `vitest.config.ts` with jsdom environment
- Test files in `src/test/` with `setup.ts` for global test configuration
- Example test in `src/test/example.test.ts`
- Run with `npm test` or `npm run test:watch`


