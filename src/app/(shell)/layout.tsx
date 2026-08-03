import { AppShell } from "@/shared/components/layout/app-shell"

export default function ShellLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AppShell>{children}</AppShell>
}
