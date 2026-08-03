import { Button } from "@/shared/components/ui/button"

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">MediSign UMG</h1>
          <p>Proyecto configurado con Screaming Architecture.</p>
          <p>Stack: Next.js, TypeScript, Tailwind, shadcn/ui, Zustand, TanStack Query, RHF, Zod y Sonner.</p>
          <Button className="mt-2">Button</Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Presiona <kbd>d</kbd> para alternar el tema)
        </div>
      </div>
    </div>
  )
}
