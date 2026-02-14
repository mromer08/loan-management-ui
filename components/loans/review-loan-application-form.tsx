"use client"

import { useForm } from "@tanstack/react-form-nextjs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { approveLoanApplication, rejectLoanApplication } from "@/lib/api/loans"
import { reviewLoanApplicationRequestSchema } from "@/lib/schemas/loan"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

type ReviewMode = "approve" | "reject"

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

export function ReviewLoanApplicationForm({
  customerId,
  loanId,
  mode,
}: {
  customerId: string
  loanId: string
  mode: ReviewMode
}) {
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      notes: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = reviewLoanApplicationRequestSchema.safeParse(value)

      if (!parsed.success) {
        toast.error("Revisa las notas antes de enviar.")
        return
      }

      try {
        if (mode === "approve") {
          await approveLoanApplication(loanId, parsed.data)
          toast.success("Prestamo aprobado correctamente.")
          router.push(`/dashboard/customers/${customerId}/loans/approved`)
        } else {
          await rejectLoanApplication(loanId, parsed.data)
          toast.success("Prestamo rechazado correctamente.")
          router.push(`/dashboard/customers/${customerId}/loans/rejected`)
        }
        router.refresh()
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "No se pudo procesar la solicitud"
        toast.error(message)
      }
    },
  })

  const title =
    mode === "approve" ? "Razon de aprobacion" : "Razon de rechazo"
  const submitLabel =
    mode === "approve" ? "Confirmar aprobacion" : "Confirmar rechazo"

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
          <FieldGroup>
            <form.Field
              name="notes"
              validators={{
                onBlur: ({ value }) => {
                  const result = reviewLoanApplicationRequestSchema.safeParse({
                    notes: value,
                  })

                  if (result.success) {
                    return undefined
                  }

                  return result.error.issues.find((issue) => issue.path[0] === "notes")
                    ?.message
                },
              }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>{title}</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      maxLength={200}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Escribe una nota para esta decision"
                    />
                    {isInvalid && (
                      <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                    )}
                  </Field>
                )
              }}
            </form.Field>
          </FieldGroup>

          <div className="flex justify-end">
            <Button type="submit">{submitLabel}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
