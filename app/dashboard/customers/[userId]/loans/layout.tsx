import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getCustomerById } from "@/lib/api/customers"
import { PlusCircle } from "lucide-react"

export default async function CustomerLoansLayout({
  params,
  children,
}: {
  children: React.ReactNode
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  const customer = await getCustomerById(userId)
  const fullName = `${customer.firstName} ${customer.lastName}`.trim()

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 py-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            <Link
              href={`/dashboard/customers/${userId}/loans`}
              className="hover:underline"
            >
              {fullName}
            </Link>
          </h1>
          <p className="text-muted-foreground text-sm">Prestamos del cliente</p>
        </div>

        <Button asChild>
          <Link href={`/dashboard/customers/${userId}/loans/create`}>
          <PlusCircle className="mr-2 h-4 w-4" />
            Solicitar prestamo
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="pt-2">{children}</div>
    </section>
  )
}
