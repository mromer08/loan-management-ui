import { CustomerForm } from "@/components/customers/customer-form"

export default function NewCustomerPage() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Registrar cliente</h1>
        <p className="text-muted-foreground text-sm">
          Ingresa los datos del cliente para crearlo en la plataforma.
        </p>
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <CustomerForm />
      </div>
    </section>
  )
}
