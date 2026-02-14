"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

type CustomerLoansNavProps = {
  userId: string
}

const getLoanNavItems = (userId: string) => [
  {
    label: "Prestamos en proceso",
    href: `/dashboard/customers/${userId}/loans/in-process`,
  },
  {
    label: "Prestamos aprobados",
    href: `/dashboard/customers/${userId}/loans/approved`,
  },
  {
    label: "Prestamos rechazados",
    href: `/dashboard/customers/${userId}/loans/rejected`,
  },
]

export function CustomerLoansNav({ userId }: CustomerLoansNavProps) {
  const pathname = usePathname()
  const items = getLoanNavItems(userId)

  return (
    <nav aria-label="Navegacion de prestamos" className="border-b">
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "inline-flex h-10 items-center border-b-2 border-transparent px-1 text-sm font-medium text-muted-foreground transition-colors",
                  "hover:text-foreground",
                  isActive && "border-primary text-foreground"
                )}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
