import { CustomerForm } from "@/components/customers/customer-form"
import { getCustomerById } from "@/lib/api/customers"
import type { CreateCustomerRequest } from "@/lib/schemas/customer"

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  const customer = await getCustomerById(userId)

  const initialValues: CreateCustomerRequest = {
    firstName: customer.firstName ?? "",
    lastName: customer.lastName ?? "",
    identificationNumber: customer.identificationNumber ?? "",
    birthDate: customer.birthDate ?? "",
    address: customer.address ?? "",
    email: customer.email ?? "",
    phone: customer.phone ?? "",
  }

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Editar cliente</h1>
        <p className="text-muted-foreground text-sm">
          Actualiza la informacion del cliente y guarda los cambios.
        </p>
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <CustomerForm
          mode="edit"
          customerId={userId}
          initialValues={initialValues}
        />
      </div>
    </section>
  )
}
