"use client"

import Link from "next/link"
import { useState } from "react"
import { EllipsisVertical, Eye, History, HandCoins, Wallet, CheckCircle2, XCircle } from "lucide-react"

import { LoanDialogInfo } from "@/components/loans/loan-dialog-info"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { LoanListStatus } from "@/components/loans/loans-table-client"
import type { LoanResponse } from "@/lib/schemas/loan"

export function LoanActions({
  customerId,
  loan,
  status,
}: {
  customerId: string
  loan: LoanResponse
  status: LoanListStatus
}) {
  const [openInfo, setOpenInfo] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground data-[state=open]:bg-muted"
          >
            <EllipsisVertical />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onSelect={() => setOpenInfo(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver detalle
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={`/dashboard/customers/${customerId}/loans/${loan.id}/history`}>
              <History className="mr-2 h-4 w-4" />
              Historial estado
            </Link>
          </DropdownMenuItem>

          {status === "APPROVED" && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/customers/${customerId}/loans/${loan.id}/payments/create`}
                >
                  <HandCoins className="mr-2 h-4 w-4" />
                  Realizar pago
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href={`/dashboard/customers/${customerId}/loans/${loan.id}/payments`}>
                  <Wallet className="mr-2 h-4 w-4" />
                  Historial pagos
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {status === "IN_PROCESS" && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href={`/dashboard/customers/${customerId}/loans/${loan.id}/approve`}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Aprobar
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href={`/dashboard/customers/${customerId}/loans/${loan.id}/reject`}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Rechazar
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <LoanDialogInfo loan={loan} open={openInfo} onOpenChange={setOpenInfo} />
    </>
  )
}
