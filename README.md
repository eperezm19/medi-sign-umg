# MediSign UMG

Firma digital de expedientes médicos — Universidad Mariano Gálvez.

## Stack

- Next.js 16 + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Zustand
- TanStack Query
- React Hook Form + Zod
- Sonner

## Estructura (Screaming Architecture)

```
src/
├── app/                      # Rutas Next.js (App Router)
├── features/                 # Dominios de negocio
│   ├── medical-record/
│   ├── key-generation/
│   ├── digital-signature/
│   ├── signature-verification/
│   ├── document-alteration/
│   └── document-comparison/
├── shared/                   # UI, hooks y utilidades compartidas
├── providers/                # Providers de la app
└── stores/                   # Stores Zustand
```

## Scripts

```bash
pnpm dev        # Desarrollo
pnpm build      # Build de producción
pnpm lint       # ESLint
pnpm typecheck  # TypeScript
```

## Componentes shadcn/ui

```bash
pnpm dlx shadcn@latest add button
```

Los componentes se generan en `src/shared/components/ui`.
