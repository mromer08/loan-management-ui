"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface LoanNotesDialogProps {
  notes?: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoanNotesDialog({
  notes,
  open,
  onOpenChange,
}: LoanNotesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Notas</DialogTitle>
        </DialogHeader>

        <Textarea
          readOnly
          value={notes?.trim() ? notes : "-"}
          className="min-h-[140px] resize-none"
          aria-label="Notas del prestamo"
        />
      </DialogContent>
    </Dialog>
  )
}
