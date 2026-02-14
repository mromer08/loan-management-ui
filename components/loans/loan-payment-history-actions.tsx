"use client"

import { useState } from "react"
import { EllipsisVertical, FileText } from "lucide-react"

import { LoanNotesDialog } from "@/components/loans/loan-notes-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface LoanPaymentHistoryActionsProps {
  notes?: string | null
}

export function LoanPaymentHistoryActions({ notes }: LoanPaymentHistoryActionsProps) {
  const [openNotes, setOpenNotes] = useState(false)

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
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onSelect={() => setOpenNotes(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Ver notas
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LoanNotesDialog notes={notes} open={openNotes} onOpenChange={setOpenNotes} />
    </>
  )
}
