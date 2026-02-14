import { redirect } from "next/navigation"

export default async function LoanDetailsPage({
  params,
}: {
  params: Promise<{ userId: string; loanId: string }>
}) {
  const { userId, loanId } = await params

  redirect(`/dashboard/customers/${userId}/loans/${loanId}/history`)
}
