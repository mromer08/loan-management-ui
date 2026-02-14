"use client"

import { AlertCircleIcon, CheckIcon, CircleDashedIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

interface PaymentStatusBadgeProps {
  status?: string | null
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  if (!status) {
    return <Badge variant="outline">-</Badge>
  }

  switch (status) {
    case "PAID":
      return (
        <Badge className="flex items-center gap-1">
          <CheckIcon className="h-3.5 w-3.5" />
          Pagado
        </Badge>
      )
    case "UNPAID":
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <AlertCircleIcon className="h-3.5 w-3.5" />
          No pagado
        </Badge>
      )
    case "PARTIALLY_PAID":
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <CircleDashedIcon className="h-3.5 w-3.5" />
          Pagado parcialmente
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <AlertCircleIcon className="h-3.5 w-3.5" />
          {status.replaceAll("_", " ")}
        </Badge>
      )
  }
}
