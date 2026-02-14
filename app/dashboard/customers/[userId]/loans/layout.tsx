export default async function CustomerLoansLayout({
    params,
  children,
}: {
  children: React.ReactNode,
  params: Promise<{ userId: string }>
}) {
    const { userId } = await params;
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-6">
      prestamos de usuario {userId}
    </section>
  )
}