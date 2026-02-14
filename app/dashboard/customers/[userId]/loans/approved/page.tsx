import { Suspense } from "react"

import { SpinnerLoader } from "@/components/common/spinner-loader"
import { CustomerLoansNav } from "@/components/customers/customer-loans-nav"
import { LoansTable } from "@/components/loans/loans-table"

export default async function CustomerLoansApprovedPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>
  searchParams?: Promise<{
    page?: string
    size?: string
  }>
}) {
  const { userId } = await params
  const resolvedSearchParams = await searchParams
  const currentPage = Math.max(0, Number(resolvedSearchParams?.page) || 0)
  const pageSize = Math.max(1, Number(resolvedSearchParams?.size) || 10)

  return (
    <section className="space-y-4">
      <CustomerLoansNav userId={userId} />
      <Suspense
        key={`loans-approved-${currentPage}-${pageSize}`}
        fallback={<SpinnerLoader label="Cargando prestamos aprobados..." />}
      >
        <LoansTable
          customerId={userId}
          status="APPROVED"
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </Suspense>
    </section>
  )
}
