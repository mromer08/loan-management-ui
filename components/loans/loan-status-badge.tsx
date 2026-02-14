"use client"

import { AlertCircleIcon, CheckIcon, Clock3Icon, XCircleIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

interface LoanStatusBadgeProps {
  status?: string | null
}

export function LoanStatusBadge({ status }: LoanStatusBadgeProps) {
  if (!status) {
    return <Badge variant="outline">-</Badge>
  }

  switch (status) {
    case "APPROVED":
      return (
        <Badge className="flex items-center gap-1">
          <CheckIcon className="h-3.5 w-3.5" />
          Aprobado
        </Badge>
      )
    case "IN_PROCESS":
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock3Icon className="h-3.5 w-3.5" />
          En proceso
        </Badge>
      )
    case "REJECTED":
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircleIcon className="h-3.5 w-3.5" />
          Rechazado
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
