"use client"

import Link from "next/link"
import { useState } from "react"
import { MenuIcon, ShieldCheck } from "lucide-react"

import { AppNavigation } from "@/shared/components/app-navigation"
import { Button } from "@/shared/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet"

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="size-4" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold tracking-tight">
              MediSign UMG
            </span>
            <span className="hidden text-[11px] text-muted-foreground sm:block">
              Firma digital de archivos médicos
            </span>
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="flex items-center gap-2">
          <AppNavigation />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                  aria-label="Abrir menú de navegación"
                />
              }
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,20rem)]">
              <SheetHeader>
                <SheetTitle>Navegación</SheetTitle>
                <SheetDescription>
                  Flujo académico de firma y verificación de archivos.
                </SheetDescription>
              </SheetHeader>
              <div className="px-2 pb-4">
                <AppNavigation
                  orientation="vertical"
                  onNavigate={() => setOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  )
}
