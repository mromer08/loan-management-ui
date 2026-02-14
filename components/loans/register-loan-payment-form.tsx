"use client"

import { useForm } from "@tanstack/react-form-nextjs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { registerLoanPayment } from "@/lib/api/loans"
import { registerLoanPaymentRequestSchema } from "@/lib/schemas/loan"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type RegisterLoanPaymentFormValues = {
  amount: string
  paymentMethod: string
  paymentDate: string
  notes: string
}

const EMPTY_VALUES: RegisterLoanPaymentFormValues = {
  amount: "",
  paymentMethod: "",
  paymentDate: "",
  notes: "",
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

function validateField(
  field: keyof RegisterLoanPaymentFormValues,
  value: string,
  fullValues: RegisterLoanPaymentFormValues
) {
  const parsed = registerLoanPaymentRequestSchema.safeParse({
    amount: fullValues.amount,
    paymentMethod: fullValues.paymentMethod,
    paymentDate: fullValues.paymentDate,
    notes: fullValues.notes,
    [field]: value,
  })

  if (parsed.success) {
    return undefined
  }

  const issue = parsed.error.issues.find((error) => error.path[0] === field)
  return issue?.message
}

export function RegisterLoanPaymentForm({
  customerId,
  loanId,
}: {
  customerId: string
  loanId: string
}) {
  const router = useRouter()

  const form = useForm({
    defaultValues: EMPTY_VALUES,
    onSubmit: async ({ value }) => {
      const parsed = registerLoanPaymentRequestSchema.safeParse(value)

      if (!parsed.success) {
        toast.error("Revisa los campos del formulario antes de enviar.")
        return
      }

      try {
        const payment = await registerLoanPayment(loanId, parsed.data)
        toast.success("Pago registrado correctamente", {
          description: `Monto: Q ${payment.amount.toFixed(2)}`,
        })
        router.push(`/dashboard/customers/${customerId}/loans/${loanId}/payments`)
        router.refresh()
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "No se pudo registrar el pago"
        toast.error(message)
      }
    },
  })

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
              name="amount"
              validators={{
                onBlur: ({ value, fieldApi }) =>
                  validateField("amount", value, fieldApi.form.state.values),
              }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Monto</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min="0.01"
                      step="0.01"
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
              name="paymentMethod"
              validators={{
                onBlur: ({ value, fieldApi }) =>
                  validateField("paymentMethod", value, fieldApi.form.state.values),
              }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Metodo de pago</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(value) => {
                        field.handleChange(value)
                        field.handleBlur()
                      }}
                    >
                      <SelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                        <SelectValue placeholder="Selecciona metodo de pago" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="CASH">Efectivo</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field
              name="paymentDate"
              validators={{
                onBlur: ({ value, fieldApi }) =>
                  validateField("paymentDate", value, fieldApi.form.state.values),
              }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Fecha de pago</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="datetime-local"
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
          </FieldGroup>

          <form.Field
            name="notes"
            validators={{
              onBlur: ({ value, fieldApi }) =>
                validateField("notes", value, fieldApi.form.state.values),
            }}
          >
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Notas</FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    maxLength={300}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Notas opcionales del pago"
                  />
                  {isInvalid && (
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  )}
                </Field>
              )
            }}
          </form.Field>

          <div className="flex justify-end">
            <Button type="submit">Registrar pago</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
