import { getCustomers } from "@/lib/api/customers"

import { CustomersTableClient } from "@/components/customers/customers-table-client"

export async function CustomersTable({
  currentPage,
  pageSize,
  searchTerm,
}: {
  currentPage: number
  pageSize: number
  searchTerm?: string
}) {
  const response = await getCustomers({
    page: currentPage,
    size: pageSize,
    searchTerm,
  })

  return <CustomersTableClient response={response} />
}
