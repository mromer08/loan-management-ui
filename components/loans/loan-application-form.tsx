"use client"

import { useForm } from "@tanstack/react-form-nextjs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { submitLoanApplication } from "@/lib/api/loans"
import { submitLoanApplicationRequestSchema } from "@/lib/schemas/loan"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type LoanApplicationFormValues = {
  loanDate: string
  amount: string
  termMonths: string
  purpose: string
  annualInterestRate: string
}

const EMPTY_VALUES: LoanApplicationFormValues = {
  loanDate: "",
  amount: "",
  termMonths: "",
  purpose: "",
  annualInterestRate: "",
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
  field: keyof LoanApplicationFormValues,
  value: string,
  fullValues: LoanApplicationFormValues
) {
  const parsed = submitLoanApplicationRequestSchema.safeParse({
    loanDate: fullValues.loanDate,
    amount: fullValues.amount,
    termMonths: fullValues.termMonths,
    purpose: fullValues.purpose,
    annualInterestRate: fullValues.annualInterestRate,
    [field]: value,
  })

  if (parsed.success) {
    return undefined
  }

  const issue = parsed.error.issues.find((error) => error.path[0] === field)
  return issue?.message
}

export function LoanApplicationForm({ customerId }: { customerId: string }) {
  const router = useRouter()

  const form = useForm({
    defaultValues: EMPTY_VALUES,
    onSubmit: async ({ value }) => {
      const parsed = submitLoanApplicationRequestSchema.safeParse(value)

      if (!parsed.success) {
        toast.error("Revisa los campos del formulario antes de enviar.")
        return
      }

      try {
        const loan = await submitLoanApplication(customerId, parsed.data)
        toast.success("Prestamo solicitado correctamente", {
          description: `Monto: Q ${loan.amount.toFixed(2)}`,
        })
        router.push(`/dashboard/customers/${customerId}/loans/in-process`)
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "No se pudo solicitar el prestamo"
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
              name="loanDate"
              validators={{
                onBlur: ({ value, fieldApi }) =>
                  validateField("loanDate", value, fieldApi.form.state.values),
              }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Fecha del prestamo</FieldLabel>
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
              name="termMonths"
              validators={{
                onBlur: ({ value, fieldApi }) =>
                  validateField("termMonths", value, fieldApi.form.state.values),
              }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Plazo en meses</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min="1"
                      step="1"
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
              name="annualInterestRate"
              validators={{
                onBlur: ({ value, fieldApi }) =>
                  validateField(
                    "annualInterestRate",
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
                    <FieldLabel htmlFor={field.name}>
                      Tasa de interes anual (%)
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min="0"
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
          </FieldGroup>

          <form.Field
            name="purpose"
            validators={{
              onBlur: ({ value, fieldApi }) =>
                validateField("purpose", value, fieldApi.form.state.values),
            }}
          >
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Proposito</FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    maxLength={200}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Describe brevemente el proposito del prestamo"
                  />
                  {isInvalid && (
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  )}
                </Field>
              )
            }}
          </form.Field>

          <div className="flex justify-end">
            <Button type="submit">Solicitar prestamo</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
