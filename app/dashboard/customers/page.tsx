import { Suspense } from "react"

import { SpinnerLoader } from "@/components/common/spinner-loader"
import { CustomersTable } from "@/components/customers/customers-table"
import { SearchCustomers } from "@/components/customers/search-customers"

export default async function CustomersPage(props: {
  searchParams?: Promise<{
    page?: string
    size?: string
    searchTerm?: string
  }>
}) {
  const searchParams = await props.searchParams
  const currentPage = Math.max(0, Number(searchParams?.page) || 0)
  const pageSize = Math.max(1, Number(searchParams?.size) || 10)
  const searchTerm = searchParams?.searchTerm?.trim() || undefined

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 py-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground text-sm">
          Listado de clientes registrados en el sistema.
        </p>
      </div>

      <SearchCustomers placeholder="Buscar por CUI, nombre, correo o telefono..." />

      <Suspense
        key={`customers-${currentPage}-${pageSize}-${searchTerm ?? ""}`}
        fallback={<SpinnerLoader label="Cargando clientes..." />}
      >
        <CustomersTable
          currentPage={currentPage}
          pageSize={pageSize}
          searchTerm={searchTerm}
        />
      </Suspense>
    </section>
  )
}
