"use client"

import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

import { Input } from "@/components/ui/input"

export function SearchCustomers({
  placeholder = "Buscar clientes...",
}: {
  placeholder?: string
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", "0")

    const value = term.trim()

    if (value) {
      params.set("searchTerm", value)
    } else {
      params.delete("searchTerm")
    }

    replace(`${pathname}?${params.toString()}`)
  }, 350)

  return (
    <div className="relative w-full max-w-sm">
      <label htmlFor="search-customers" className="sr-only">
        Buscar clientes
      </label>
      <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
      <Input
        id="search-customers"
        placeholder={placeholder}
        className="pl-9"
        onChange={(event) => {
          handleSearch(event.target.value)
        }}
        defaultValue={searchParams.get("searchTerm")?.toString()}
      />
    </div>
  )
}
