import { RegisterLoanPaymentForm } from "@/components/loans/register-loan-payment-form"

export default async function CreateLoanPaymentPage({
  params,
}: {
  params: Promise<{ userId: string; loanId: string }>
}) {
  const { userId, loanId } = await params

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-2">
      <div className="text-center">
        <h2 className="text-xl font-semibold tracking-tight">Realizar pago</h2>
        <p className="text-muted-foreground text-sm">
          Registra un abono para este prestamo.
        </p>
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <RegisterLoanPaymentForm customerId={userId} loanId={loanId} />
      </div>
    </section>
  )
}
