# MediSign UMG

Firma y verificación de archivos médicos — Universidad Mariano Gálvez.

Prototipo académico que demuestra cómo una firma digital protege la integridad
de un archivo médico electrónico. No es un sistema hospitalario ni un expediente
clínico.

## Stack

- Next.js 16 + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Zustand (+ Persist)
- TanStack Query
- Lucide React
- Sonner

## Estructura (Screaming Architecture)

```
src/
├── app/                      # Rutas: /, /firmar, /verificar
├── features/
│   ├── medical-file-upload/
│   ├── key-pair-generation/
│   ├── file-signing/
│   ├── signed-file-download/
│   ├── original-file-verification/
│   ├── altered-file-upload/
│   ├── altered-file-verification/
│   └── hash-comparison/
├── shared/                   # UI, hooks y utilidades compartidas
├── providers/                # Providers de la app
└── stores/                   # useMedicalFileStore
```

## Scripts

```bash
pnpm dev        # Desarrollo
pnpm build      # Build de producción
pnpm lint       # ESLint
pnpm typecheck  # TypeScript
```
