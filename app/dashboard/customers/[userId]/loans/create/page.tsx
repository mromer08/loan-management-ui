import { LoanApplicationForm } from "@/components/loans/loan-application-form"
import { getCustomerById } from "@/lib/api/customers"

export default async function CreateCustomerLoanPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  const customer = await getCustomerById(userId)
  const fullName = `${customer.firstName} ${customer.lastName}`.trim()

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-2">
      <div className="text-center">
        <h2 className="text-xl font-semibold tracking-tight">
          Solicitud de prestamo
        </h2>
        <p className="text-muted-foreground text-sm">
          Completa el formulario para registrar una nueva solicitud.
        </p>
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <LoanApplicationForm customerId={userId} />
      </div>
    </section>
  )
}
