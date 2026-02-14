import { getLoanPayments } from "@/lib/api/loans"

import { LoanPaymentsTableClient } from "@/components/loans/loan-payments-table-client"

export async function LoanPaymentsTable({
  loanId,
  currentPage,
  pageSize,
}: {
  loanId: string
  currentPage: number
  pageSize: number
}) {
  const response = await getLoanPayments(loanId, {
    page: currentPage,
    size: pageSize,
  })

  return <LoanPaymentsTableClient response={response} />
}
