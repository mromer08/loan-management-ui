"use client"

import { useRouter } from "next/navigation"
import { ArrowLeftCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export function BackButton() {
  const router = useRouter()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push("/dashboard")
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleGoBack}
      className="ml-2 flex items-center gap-1"
    >
      <ArrowLeftCircle className="h-4 w-4" />
      Regresar
    </Button>
  )
}
