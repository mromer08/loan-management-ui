import Link from "next/link"
import type { ReactNode } from "react"

import { LoanActionsResponsive } from "@/components/loans/loan-actions-responsive"
import { getLoanById } from "@/lib/api/loans"
import { formatGTQ } from "@/lib/formatters/currency-formatter"

type LoanListStatus = "IN_PROCESS" | "APPROVED" | "REJECTED"

function formatDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function toLoanListStatus(status: string): LoanListStatus {
  if (status === "APPROVED" || status === "IN_PROCESS" || status === "REJECTED") {
    return status
  }

  return "IN_PROCESS"
}

export default async function LoanDetailsLayout({
  params,
  children,
}: {
  params: Promise<{ userId: string; loanId: string }>
  children: ReactNode
}) {
  const { userId, loanId } = await params
  const loan = await getLoanById(loanId)
  const loanStatus = toLoanListStatus(loan.status)

  return (
    <section className="space-y-4">
      <div className="p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="text-sm">
            <span className="text-muted-foreground">
              <Link
                href={`/dashboard/customers/${userId}/loans/${loanId}`}
                className="text-foreground underline-offset-4 hover:underline"
              >
                Prestamo del: {formatDateTime(loan.loanDate)}
              </Link>
              {" · "}
              Monto total: {formatGTQ(loan.totalPayable)}
              {" · "}
              Saldo: {formatGTQ(loan.outstandingBalance)}
            </span>
          </div>

          <div className="flex items-start sm:items-end">
            <LoanActionsResponsive
              customerId={userId}
              loan={loan}
              status={loanStatus}
              mode="button"
            />
          </div>
        </div>

        <div className="mt-3">
          <LoanActionsResponsive customerId={userId} loan={loan} status={loanStatus} mode="nav" />
        </div>
      </div>

      <div className="min-w-0">{children}</div>
    </section>
  )
}
