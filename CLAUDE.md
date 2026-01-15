# Derbin Davidraj Portfolio - Development Standards

## Project Overview
A stunning graphic designer portfolio website for Derbin Davidraj - Brand & Marketing Designer (GenAI-enabled).

## Tech Stack
- **Frontend**: React 18 + Vite 5 + TypeScript
- **Styling**: Tailwind CSS 3.4
- **Animations**: GSAP 3 + Framer Motion 11
- **Backend**: Supabase (Auth + Database + Storage)
- **Deployment**: Vercel

## Code Organization

### File Size Limit
Keep files under 500 lines. Refactor into smaller modules when approaching this limit.

### Directory Structure
```
src/
├── components/
│   ├── ui/        # Reusable UI elements (Button, Card, Modal)
│   ├── common/    # Layout components (Navbar, Footer, Loader)
│   └── sections/  # Page sections (Hero, About, Projects)
├── pages/         # Route-based pages
├── hooks/         # Custom React hooks
├── context/       # React Context providers
├── lib/           # Utility functions and configs
├── types/         # TypeScript type definitions
└── data/          # Static content and data
```

## Coding Standards

### TypeScript
- Use strict mode
- Define interfaces for all props and data structures
- Avoid `any` type - use proper typing

### React Components
- Use functional components with hooks
- Implement proper error boundaries
- Use React.memo for expensive renders
- Keep components focused and single-purpose

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use CSS custom properties for theme values
- Keep consistent spacing using Tailwind scale

### Animations
- Use GSAP for complex scroll animations
- Use Framer Motion for component transitions
- Keep animations performant (use transform/opacity)
- Respect reduced-motion preferences

## Testing Checklist
1. Run `npm run dev` - verify hot reload
2. Test theme toggle (dark/light mode)
3. Test all animations on scroll
4. Test responsive design at all breakpoints
5. Run `npm run build` - verify no TypeScript errors
6. Test Lighthouse scores (target 90+)

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
