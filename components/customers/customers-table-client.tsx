"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { DataTable } from "@/components/common/data-table"
import { CustomerActions } from "@/components/customers/customer-actions"
import type {
  CustomerResponse,
  CustomersPageResponse,
} from "@/lib/schemas/customer"

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

export function CustomersTableClient({
  response,
}: {
  response: CustomersPageResponse
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const columns = React.useMemo<ColumnDef<CustomerResponse>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: "Nombre",
        cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
      },
      {
        accessorKey: "identificationNumber",
        header: "CUI",
      },
      {
        accessorKey: "email",
        header: "Correo",
      },
      {
        accessorKey: "phone",
        header: "Telefono",
      },
      {
        accessorKey: "birthDate",
        header: "Fecha nacimiento",
        cell: ({ row }) => formatDate(row.original.birthDate),
      },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => <CustomerActions customer={row.original} />,
      },
    ],
    []
  )
  const currentSize = Math.max(1, Number(searchParams.get("size") ?? 10))

  const goToPage = React.useCallback(
    (page: number, size: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", String(page))
      params.set("size", String(size))
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  return (
    <DataTable
      data={response.data}
      columns={columns}
      emptyMessage="No hay clientes registrados"
      serverPagination={{
        pageIndex: response.pageNumber,
        pageSize: currentSize,
        pageCount: response.totalPages,
        totalRows: response.totalElements,
        onPageChange: (nextPage) => {
          goToPage(nextPage, currentSize)
        },
        onPageSizeChange: (nextSize) => {
          goToPage(0, nextSize)
        },
      }}
    />
  )
}
