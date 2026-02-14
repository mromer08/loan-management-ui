import { Suspense } from "react"

import { SpinnerLoader } from "@/components/common/spinner-loader"
import { LoanPaymentsTable } from "@/components/loans/loan-payments-table"

export default async function LoanPaymentsHistoryPage({
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
        <h2 className="text-xl font-semibold tracking-tight">Historial de pagos</h2>
        <p className="text-muted-foreground text-sm">
          Registro cronologico de pagos aplicados al prestamo.
        </p>
      </div>

      <Suspense
        key={`loan-payments-${loanId}-${currentPage}-${pageSize}`}
        fallback={<SpinnerLoader label="Cargando historial de pagos..." />}
      >
        <LoanPaymentsTable
          loanId={loanId}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </Suspense>
    </section>
  )
}
