"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { CheckCircle2, Eye, HandCoins, History, Wallet, XCircle } from "lucide-react"

import { LoanDialogInfo } from "@/components/loans/loan-dialog-info"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { LoanResponse } from "@/lib/schemas/loan"

type LoanListStatus = "IN_PROCESS" | "APPROVED" | "REJECTED"

interface LoanActionsResponsiveProps {
  customerId: string
  loan: LoanResponse
  status: LoanListStatus
  mode?: "button" | "nav" | "all"
}

export function LoanActionsResponsive({
  customerId,
  loan,
  status,
  mode = "all",
}: LoanActionsResponsiveProps) {
  const pathname = usePathname()
  const [openInfo, setOpenInfo] = useState(false)
  const loanBasePath = `/dashboard/customers/${customerId}/loans/${loan.id}`

  const actions = [
    {
      label: "Historial estado",
      href: `${loanBasePath}/history`,
      icon: History,
    },
    ...(status === "APPROVED"
      ? [
          {
            label: "Realizar pago",
            href: `${loanBasePath}/payments/create`,
            icon: HandCoins,
          },
          {
            label: "Historial pagos",
            href: `${loanBasePath}/payments`,
            icon: Wallet,
          },
        ]
      : []),
    ...(status === "IN_PROCESS"
      ? [
          {
            label: "Aprobar",
            href: `${loanBasePath}/approve`,
            icon: CheckCircle2,
          },
          {
            label: "Rechazar",
            href: `${loanBasePath}/reject`,
            icon: XCircle,
          },
        ]
      : []),
  ]

  return (
    <>
      {(mode === "button" || mode === "all") && (
        <>
          <Button size="sm" onClick={() => setOpenInfo(true)} variant="secondary">
            <Eye className="mr-2 h-4 w-4" />
            Ver detalle
          </Button>
          <LoanDialogInfo loan={loan} open={openInfo} onOpenChange={setOpenInfo} />
        </>
      )}

      {(mode === "nav" || mode === "all") && (
        <nav aria-label="Acciones del prestamo" className="w-full border-b">
          <ul className="flex flex-wrap items-center gap-1">
            {actions.map((action) => {
              const Icon = action.icon
              const isActive =
                pathname === action.href || pathname.startsWith(`${action.href}/`)

              return (
                <li key={action.href}>
                  <Link
                    href={action.href}
                    className={cn(
                      "inline-flex h-9 items-center border-b-2 border-transparent px-2 text-sm font-medium text-muted-foreground transition-colors",
                      "hover:text-foreground",
                      isActive && "border-primary text-foreground"
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {action.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </>
  )
}
