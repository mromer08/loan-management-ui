import { ReviewLoanApplicationForm } from "@/components/loans/review-loan-application-form"

export default async function ApproveLoanPage({
  params,
}: {
  params: Promise<{ userId: string; loanId: string }>
}) {
  const { userId, loanId } = await params

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-2">
      {/* <div className="text-center">
        <h2 className="text-xl font-semibold tracking-tight">Aprobar prestamo</h2>
        <p className="text-muted-foreground text-sm">
          Ingresa una nota para confirmar la aprobacion.
        </p>
      </div> */}

      <div className="mx-auto w-full max-w-3xl">
        <ReviewLoanApplicationForm
          customerId={userId}
          loanId={loanId}
          mode="approve"
        />
      </div>
    </section>
  )
}
