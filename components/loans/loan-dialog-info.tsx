"use client"

import type React from "react"

import { LoanStatusBadge } from "@/components/loans/loan-status-badge"
import { PaymentStatusBadge } from "@/components/loans/payment-status-badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatGTQ } from "@/lib/formatters/currency-formatter"
import type { LoanResponse } from "@/lib/schemas/loan"

function formatDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs font-medium">
        {label}
      </span>
      <div className="text-sm wrap-break-word">{children}</div>
    </div>
  )
}

export function LoanDialogInfo({
  loan,
  open,
  onOpenChange,
}: {
  loan: LoanResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-full
          max-w-5xl
          max-h-[85vh]
          overflow-y-auto
        "
      >
        <DialogHeader>
          <DialogTitle>Detalle del préstamo</DialogTitle>
        </DialogHeader>

        {/* GRID PRINCIPAL */}
        <div className="mt-4 grid gap-8 md:grid-cols-2">

          {/* COLUMNA 1 */}
          <div className="space-y-4">
            <Field label="ID préstamo">{loan.id}</Field>
            <Field label="Cliente">{loan.customerFullName}</Field>
            <Field label="Fecha">{formatDateTime(loan.loanDate)}</Field>
            <Field label="Plazo (meses)">{loan.termMonths}</Field>

            <Field label="Tasa interés anual">
              {loan.annualInterestRate == null
                ? "-"
                : `${loan.annualInterestRate.toFixed(2)}%`}
            </Field>

            <Field label="Estado préstamo">
              <LoanStatusBadge status={loan.status} />
            </Field>
          </div>

          {/* COLUMNA 2 */}
          <div className="space-y-4">
            <Field label="Valor inicial">{formatGTQ(loan.amount)}</Field>
            <Field label="Monto total">{formatGTQ(loan.totalPayable)}</Field>
            <Field label="Saldo pendiente">
              {formatGTQ(loan.outstandingBalance)}
            </Field>

            <Field label="Estado pago">
              <PaymentStatusBadge status={loan.paymentStatus} />
            </Field>

            <Field label="Creado en">
              {formatDateTime(loan.createdAt)}
            </Field>

            <Field label="Actualizado en">
              {formatDateTime(loan.updatedAt)}
            </Field>
          </div>

          {/* PROPÓSITO */}
          <div className="md:col-span-2 space-y-2 pt-6 border-t">
            <span className="text-muted-foreground text-xs font-medium">
              Propósito
            </span>

            <div className="
              rounded-lg
              border
              bg-muted/40
              p-4
              text-sm
              leading-relaxed
              whitespace-pre-wrap
              wrap-break-word
            ">
              {loan.purpose?.trim() ? loan.purpose : "-"}
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
