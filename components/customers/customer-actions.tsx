"use client"

import Link from "next/link"
import { useState } from "react"
import { EllipsisVertical, Eye, HandCoins, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CustomerDialogInfo } from "@/components/customers/customer-dialog-info"
import { DeleteCustomerDialog } from "@/components/customers/delete-customer-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { CustomerResponse } from "@/lib/schemas/customer"

export function CustomerActions({ customer }: { customer: CustomerResponse }) {
  const { id } = customer
  const [openInfo, setOpenInfo] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground data-[state=open]:bg-muted"
          >
            <EllipsisVertical />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onSelect={() => setOpenInfo(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver informacion
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={`/dashboard/customers/${id}/loans`}>
              <HandCoins className="mr-2 h-4 w-4" />
              Ver prestamos
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={`/dashboard/customers/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onSelect={(event) => {
              event.preventDefault()
              setOpenDelete(true)
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CustomerDialogInfo
        customer={customer}
        open={openInfo}
        onOpenChange={setOpenInfo}
      />

      <DeleteCustomerDialog
        customerId={id}
        open={openDelete}
        onOpenChange={setOpenDelete}
      />
    </>
  )
}
