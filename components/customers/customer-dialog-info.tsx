"use client"

import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { CustomerResponse } from "@/lib/schemas/customer"

function formatDateTime(value: string) {
  const date = parseISO(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return format(date, "PPpp", { locale: es })
}

function formatDate(value: string) {
  const date = parseISO(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return format(date, "PPP", { locale: es })
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-4">
      <span className="text-muted-foreground text-sm font-medium">{label}</span>
      <span className="text-sm wrap-break-word">{value}</span>
    </div>
  )
}

export function CustomerDialogInfo({
  customer,
  open,
  onOpenChange,
}: {
  customer: CustomerResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl sm:max-w-2xl">
        <AlertDialogHeader className="items-start text-left">
          <AlertDialogTitle>Informacion del cliente</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-3">
          <InfoRow label="Nombre" value={customer.firstName} />
          <InfoRow label="Apellido" value={customer.lastName} />
          <InfoRow label="CUI" value={customer.identificationNumber} />
          <InfoRow label="Fecha de nacimiento" value={formatDate(customer.birthDate)} />
          <InfoRow label="Direccion" value={customer.address} />
          <InfoRow label="Correo" value={customer.email} />
          <InfoRow label="Telefono" value={customer.phone} />
          <InfoRow label="Creado en" value={formatDateTime(customer.createdAt)} />
          <InfoRow label="Actualizado en" value={formatDateTime(customer.updatedAt)} />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
