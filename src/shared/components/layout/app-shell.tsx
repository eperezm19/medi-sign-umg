import { PrototypeNotice } from "@/shared/components/layout/prototype-notice"
import { SiteHeader } from "@/shared/components/layout/site-header"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <PrototypeNotice />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>MediSign UMG · Universidad Mariano Gálvez</p>
          <p>Prototipo académico de firma digital de archivos médicos</p>
        </div>
      </footer>
    </div>
  )
}
