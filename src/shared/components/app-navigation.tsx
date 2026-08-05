"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileCheck2, FilePenLine, Home } from "lucide-react"

import { cn } from "@/shared/lib/utils"

const NAV_ITEMS = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/firmar", label: "Firmar archivo", icon: FilePenLine },
  { href: "/verificar", label: "Verificar archivo", icon: FileCheck2 },
] as const

export function AppNavigation({
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
