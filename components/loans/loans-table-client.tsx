"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { DataTable } from "@/components/common/data-table"
import { LoanActions } from "@/components/loans/loan-actions"
import { LoanStatusBadge } from "@/components/loans/loan-status-badge"
import { PaymentStatusBadge } from "@/components/loans/payment-status-badge"
import { formatGTQ } from "@/lib/formatters/currency-formatter"
import type { LoanResponse, LoansPageResponse } from "@/lib/schemas/loan"

export type LoanListStatus = "IN_PROCESS" | "APPROVED" | "REJECTED"

function formatShortDate(value: string) {
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

function buildColumns(
  customerId: string,
  status: LoanListStatus
): ColumnDef<LoanResponse>[] {
  if (status === "APPROVED") {
    return [
      {
        accessorKey: "loanDate",
        header: "Fecha",
        cell: ({ row }) => (
          <Link
            href={`/dashboard/customers/${customerId}/loans/${row.original.id}/history`}
            className="underline-offset-4 hover:underline"
          >
            {formatShortDate(row.original.loanDate)}
          </Link>
        ),
      },
      {
        accessorKey: "amount",
        header: "Valor inicial",
        cell: ({ row }) => formatGTQ(row.original.amount),
      },
      {
        accessorKey: "totalPayable",
        header: "Monto total",
        cell: ({ row }) => formatGTQ(row.original.totalPayable),
      },
      {
        accessorKey: "outstandingBalance",
        header: "Saldo pendiente",
        cell: ({ row }) => formatGTQ(row.original.outstandingBalance),
      },
      {
        accessorKey: "paymentStatus",
        header: "Estado de pago",
        cell: ({ row }) => <PaymentStatusBadge status={row.original.paymentStatus} />,
      },
      {
        accessorKey: "status",
        header: "Estado prestamo",
        cell: ({ row }) => <LoanStatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => (
          <LoanActions customerId={customerId} loan={row.original} status={status} />
        ),
      },
    ]
  }

  return [
    {
      accessorKey: "loanDate",
      header: "Fecha",
      cell: ({ row }) => (
        <Link
          href={`/dashboard/customers/${customerId}/loans/${row.original.id}/history`}
          className="underline-offset-4 hover:underline"
        >
          {formatShortDate(row.original.loanDate)}
        </Link>
      ),
    },
    {
      accessorKey: "amount",
      header: "Valor inicial",
      cell: ({ row }) => formatGTQ(row.original.amount),
    },
    {
      accessorKey: "status",
      header: "Estado prestamo",
      cell: ({ row }) => <LoanStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <LoanActions customerId={customerId} loan={row.original} status={status} />
      ),
    },
  ]
}

export function LoansTableClient({
  customerId,
  status,
  response,
}: {
  customerId: string
  status: LoanListStatus
  response: LoansPageResponse
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const columns = React.useMemo<ColumnDef<LoanResponse>[]>(
    () => buildColumns(customerId, status),
    [customerId, status]
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
      emptyMessage="No hay prestamos para este estado"
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
