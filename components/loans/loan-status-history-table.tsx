import { getLoanStatusHistory } from "@/lib/api/loans"

import { LoanStatusHistoryTableClient } from "@/components/loans/loan-status-history-table-client"

export async function LoanStatusHistoryTable({
  loanId,
  currentPage,
  pageSize,
}: {
  loanId: string
  currentPage: number
  pageSize: number
}) {
  const response = await getLoanStatusHistory(loanId, {
    page: currentPage,
    size: pageSize,
  })

  return <LoanStatusHistoryTableClient response={response} />
}
