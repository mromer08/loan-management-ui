import { Suspense } from "react"

import { SpinnerLoader } from "@/components/common/spinner-loader"
import { LoanStatusHistoryTable } from "@/components/loans/loan-status-history-table"

export default async function LoanStatusHistoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string; loanId: string }>
  searchParams?: Promise<{
    page?: string
    size?: string
  }>
}) {
  const { loanId } = await params
  const resolvedSearchParams = await searchParams
  const currentPage = Math.max(0, Number(resolvedSearchParams?.page) || 0)
  const pageSize = Math.max(1, Number(resolvedSearchParams?.size) || 10)

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Historial de estado del prestamo
        </h2>
        <p className="text-muted-foreground text-sm">
          Registro cronologico de cambios de estado.
        </p>
      </div>

      <Suspense
        key={`loan-status-history-${loanId}-${currentPage}-${pageSize}`}
        fallback={<SpinnerLoader label="Cargando historial de estado..." />}
      >
        <LoanStatusHistoryTable
          loanId={loanId}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </Suspense>
    </section>
  )
}
