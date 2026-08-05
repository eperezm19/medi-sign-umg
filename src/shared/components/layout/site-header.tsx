"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { FileCheck2, FilePenLine, Home, MenuIcon, ShieldCheck } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet"
import { cn } from "@/shared/lib/utils"

const NAV_ITEMS = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/firmar", label: "Firmar archivo", icon: FilePenLine },
  { href: "/verificar", label: "Verificar archivo", icon: FileCheck2 },
] as const

function NavLinks({
  onNavigate,
  className,
  orientation = "horizontal",
}: {
  onNavigate?: () => void
  className?: string
  orientation?: "horizontal" | "vertical"
}) {
  const pathname = usePathname()

  return (
    <ul
      className={cn(
        orientation === "horizontal"
          ? "hidden items-center gap-1 md:flex"
          : "flex flex-col gap-1",
        className
      )}
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`)
        const Icon = item.icon

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                orientation === "vertical" && "w-full",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4 opacity-80" aria-hidden />
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

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
          <NavLinks />

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
                <NavLinks
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
