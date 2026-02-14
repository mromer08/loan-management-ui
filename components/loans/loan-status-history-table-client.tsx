"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { DataTable } from "@/components/common/data-table"
import { LoanStatusHistoryActions } from "@/components/loans/loan-status-history-actions"
import { LoanStatusBadge } from "@/components/loans/loan-status-badge"
import type { LoanStatusHistoryPageResponse, LoanStatusHistoryResponse } from "@/lib/schemas/loan"

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

export function LoanStatusHistoryTableClient({
  response,
}: {
  response: LoanStatusHistoryPageResponse
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const columns = React.useMemo<ColumnDef<LoanStatusHistoryResponse>[]>(
    () => [
      {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => <LoanStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "createdAt",
        header: "Fecha",
        cell: ({ row }) => formatDateTime(row.original.createdAt),
      },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => <LoanStatusHistoryActions notes={row.original.notes} />,
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
      emptyMessage="No hay historial de estado para este prestamo"
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
