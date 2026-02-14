"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { deleteCustomer } from "@/lib/api/customers"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function DeleteCustomerDialog({
  customerId,
  open,
  onOpenChange,
}: {
  customerId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteCustomer = async () => {
    setIsDeleting(true)

    try {
      await deleteCustomer(customerId)
      toast.success("Cliente eliminado correctamente.")
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo eliminar el cliente"
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader className="items-start text-left">
          <AlertDialogTitle>Eliminar cliente</AlertDialogTitle>
          <AlertDialogDescription>
            Esta accion no es reversible. Se eliminaran todos los prestamos e
            historial de pagos del cliente.
          </AlertDialogDescription>
          <AlertDialogDescription>
            Si el cliente tiene prestamos aprobados pendientes de pago, no será posible
            eliminarlo hasta que se resuelvan dichos prestamos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isDeleting}
            onClick={(event) => {
              event.preventDefault()
              void handleDeleteCustomer()
            }}
          >
            {isDeleting ? "Eliminando..." : "Eliminar cliente"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
