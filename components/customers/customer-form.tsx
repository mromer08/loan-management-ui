"use client"

import { useForm } from "@tanstack/react-form-nextjs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { createCustomer, updateCustomer } from "@/lib/api/customers"
import {
  createCustomerRequestSchema,
  updateCustomerRequestSchema,
  type CreateCustomerRequest,
} from "@/lib/schemas/customer"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const EMPTY_CUSTOMER: CreateCustomerRequest = {
  firstName: "",
  lastName: "",
  identificationNumber: "",
  birthDate: "",
  address: "",
  email: "",
  phone: "",
}

type CustomerFormMode = "create" | "edit"

function getFieldError(
  mode: CustomerFormMode,
  field: keyof CreateCustomerRequest,
  value: string,
  fullValues: CreateCustomerRequest
) {
  const schema =
    mode === "edit" ? updateCustomerRequestSchema : createCustomerRequestSchema

  const result = schema.safeParse({
    ...fullValues,
    [field]: value,
  })

  if (result.success) {
    return undefined
  }

  const issue = result.error.issues.find((error) => error.path[0] === field)
  return issue?.message
}

function toFieldErrors(errors: unknown[]) {
  return errors
    .map((error) => {
      if (typeof error === "string") {
        return { message: error }
      }

      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message?: unknown }).message === "string"
      ) {
        return { message: (error as { message: string }).message }
      }

      return undefined
    })
    .filter((error): error is { message: string } => Boolean(error))
}

export function CustomerForm({
  mode = "create",
  customerId,
  initialValues = EMPTY_CUSTOMER,
}: {
  mode?: CustomerFormMode
  customerId?: string
  initialValues?: CreateCustomerRequest
}) {
  const router = useRouter()

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      if (mode === "edit") {
        if (!customerId) {
          toast.error("No se encontro el identificador del cliente.")
          return
        }

        const parsed = updateCustomerRequestSchema.safeParse(value)

        if (!parsed.success) {
          toast.error("Revisa los campos del formulario antes de enviar.")
          return
        }

        try {
          const updated = await updateCustomer(customerId, parsed.data)
          toast.success("Cliente actualizado correctamente", {
            description: `Nombre: ${updated.firstName} ${updated.lastName}`,
          })
          router.push("/dashboard/customers")
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "No se pudo actualizar el cliente"
          toast.error(message)
        }

        return
      }

      const parsed = createCustomerRequestSchema.safeParse(value)

      if (!parsed.success) {
        toast.error("Revisa los campos del formulario antes de enviar.")
        return
      }

      try {
        const created = await createCustomer(parsed.data)
        toast.success("Cliente creado correctamente", {
          description: `Nombre: ${created.firstName} ${created.lastName}`,
        })
        router.push("/dashboard/customers")
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "No se pudo registrar el cliente"
        toast.error(message)
      }
    },
  })

  const submitLabel = mode === "edit" ? "Guardar cambios" : "Guardar cliente"

  return (
    <Card>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <form.Field
              name="firstName"
              validators={{
                onBlur: ({ value, fieldApi }) =>
                  getFieldError(mode, "firstName", value, fieldApi.form.state.values),
              }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Nombre</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field
              name="lastName"
              validators={{
                onBlur: ({ value, fieldApi }) =>
                  getFieldError(mode, "lastName", value, fieldApi.form.state.values),
              }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Apellido</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field
              name="identificationNumber"
              validators={{
                onBlur: ({ value, fieldApi }) =>
                  getFieldError(
                    mode,
                    "identificationNumber",
                    value,
                    fieldApi.form.state.values
                  ),
              }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>CUI</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      inputMode="numeric"
                      maxLength={13}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field
              name="birthDate"
              validators={{
                onBlur: ({ value, fieldApi }) =>
                  getFieldError(mode, "birthDate", value, fieldApi.form.state.values),
              }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Fecha de nacimiento</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="date"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field
              name="email"
              validators={{
                onBlur: ({ value, fieldApi }) =>
                  getFieldError(mode, "email", value, fieldApi.form.state.values),
              }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Correo electronico</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field
              name="phone"
              validators={{
                onBlur: ({ value, fieldApi }) =>
                  getFieldError(mode, "phone", value, fieldApi.form.state.values),
              }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Telefono (8 digitos)</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      inputMode="numeric"
                      maxLength={8}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                    )}
                  </Field>
                )
              }}
            </form.Field>
          </FieldGroup>

          <form.Field
            name="address"
            validators={{
              onBlur: ({ value, fieldApi }) =>
                getFieldError(mode, "address", value, fieldApi.form.state.values),
            }}
          >
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Direccion</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                  />
                  {isInvalid && (
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  )}
                </Field>
              )
            }}
          </form.Field>

          <form.Subscribe selector={(state) => [state.isSubmitting]}>
            {([isSubmitting]) => (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : submitLabel}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  )
}
