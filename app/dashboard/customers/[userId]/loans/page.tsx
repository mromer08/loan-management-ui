import { redirect } from "next/navigation"

export default async function CustomerLoansPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  redirect(`/dashboard/customers/${userId}/loans/in-process`)
}
