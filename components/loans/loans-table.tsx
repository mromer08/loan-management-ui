import { getLoanApplicationsByCustomer } from "@/lib/api/loans"

import {
  LoansTableClient,
  type LoanListStatus,
} from "@/components/loans/loans-table-client"

export async function LoansTable({
  customerId,
  status,
  currentPage,
  pageSize,
}: {
  customerId: string
  status: LoanListStatus
  currentPage: number
  pageSize: number
}) {
  const response = await getLoanApplicationsByCustomer(customerId, {
    status,
    page: currentPage,
    size: pageSize,
  })

  return <LoansTableClient customerId={customerId} status={status} response={response} />
}
