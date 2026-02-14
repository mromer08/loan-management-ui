"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { DataTable } from "@/components/common/data-table"
import { LoanPaymentHistoryActions } from "@/components/loans/loan-payment-history-actions"
import { PaymentMethodBadge } from "@/components/loans/payment-method-badge"
import { formatGTQ } from "@/lib/formatters/currency-formatter"
import type { LoanPaymentResponse, LoanPaymentsPageResponse } from "@/lib/schemas/loan"

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

export function LoanPaymentsTableClient({
  response,
}: {
  response: LoanPaymentsPageResponse
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const columns = React.useMemo<ColumnDef<LoanPaymentResponse>[]>(
    () => [
      {
        accessorKey: "paymentDate",
        header: "Fecha de pago",
        cell: ({ row }) => formatDateTime(row.original.paymentDate),
      },
      {
        accessorKey: "amount",
        header: "Monto",
        cell: ({ row }) => formatGTQ(row.original.amount),
      },
      {
        accessorKey: "paymentMethod",
        header: "Metodo",
        cell: ({ row }) => <PaymentMethodBadge method={row.original.paymentMethod} />,
      },
      {
        accessorKey: "createdAt",
        header: "Registrado en",
        cell: ({ row }) => formatDateTime(row.original.createdAt),
      },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => <LoanPaymentHistoryActions notes={row.original.notes} />,
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
      emptyMessage="No hay pagos registrados para este prestamo"
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
