"use client"

import { AlertCircleIcon, BanknoteIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

interface PaymentMethodBadgeProps {
  method?: string | null
}

export function PaymentMethodBadge({ method }: PaymentMethodBadgeProps) {
  if (!method) {
    return <Badge variant="outline">-</Badge>
  }

  switch (method) {
    case "CASH":
      return (
        <Badge className="flex items-center gap-1">
          <BanknoteIcon className="h-3.5 w-3.5" />
          Efectivo
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <AlertCircleIcon className="h-3.5 w-3.5" />
          {method.replaceAll("_", " ")}
        </Badge>
      )
  }
}
