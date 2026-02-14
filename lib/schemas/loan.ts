import { z } from "zod"

import { createPagedResponseSchema } from "@/lib/schemas/customer"

const optionalTrimmedString = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value
    }

    const trimmed = value.trim()
    return trimmed.length === 0 ? undefined : trimmed
  },
  z.string().optional()
)

export const loanResponseSchema = z.object({
  id: z.uuid(),
  customerId: z.uuid(),
  customerFullName: z.string(),
  loanDate: z.string(),
  amount: z.coerce.number(),
  termMonths: z.number().int().positive(),
  purpose: z.string().nullable().optional(),
  annualInterestRate: z.coerce.number().nullable().optional(),
  totalPayable: z.coerce.number(),
  outstandingBalance: z.coerce.number(),
  paymentStatus: z.string().nullable().optional(),
  status: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const submitLoanApplicationRequestSchema = z.object({
  loanDate: optionalTrimmedString,
  amount: z.coerce
    .number()
    .positive("El monto debe ser mayor a 0")
    .max(9999999999999999.99, "El monto excede el maximo permitido"),
  termMonths: z.coerce
    .number()
    .int("El plazo debe ser un numero entero")
    .positive("El plazo debe ser mayor a 0"),
  purpose: optionalTrimmedString.pipe(
    z.string().max(200, "El proposito no puede tener mas de 200 caracteres").optional()
  ),
  annualInterestRate: 
    z.coerce
      .number()
      .min(0, "La tasa no puede ser negativa")
      .max(999.99, "La tasa no puede ser mayor a 999.99")
})

export const reviewLoanApplicationRequestSchema = z.object({
  notes: z
    .string()
    .trim()
    .min(1, "Las notas son obligatorias")
    .max(200, "Las notas no pueden tener mas de 200 caracteres"),
})

export const loanStatusHistoryResponseSchema = z.object({
  id: z.uuid(),
  loanId: z.uuid(),
  status: z.string(),
  notes: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const loanPaymentResponseSchema = z.object({
  id: z.uuid(),
  loanId: z.uuid(),
  customerId: z.uuid(),
  amount: z.coerce.number(),
  paymentMethod: z.string(),
  paymentDate: z.string(),
  notes: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const registerLoanPaymentRequestSchema = z.object({
  amount: z.coerce
    .number()
    .min(0.01, "El monto debe ser mayor o igual a 0.01")
    .max(9999999999999999.99, "El monto excede el maximo permitido"),
  paymentMethod: z.string().trim().min(1, "El metodo de pago es obligatorio"),
  paymentDate: optionalTrimmedString,
  notes: optionalTrimmedString.pipe(
    z.string().max(300, "Las notas no pueden tener mas de 300 caracteres").optional()
  ),
})

export const loansPageResponseSchema = createPagedResponseSchema(loanResponseSchema)
export const loanStatusHistoryPageResponseSchema = createPagedResponseSchema(
  loanStatusHistoryResponseSchema
)
export const loanPaymentsPageResponseSchema = createPagedResponseSchema(
  loanPaymentResponseSchema
)

export type LoanResponse = z.infer<typeof loanResponseSchema>
export type SubmitLoanApplicationRequest = z.infer<
  typeof submitLoanApplicationRequestSchema
>
export type ReviewLoanApplicationRequest = z.infer<
  typeof reviewLoanApplicationRequestSchema
>
export type LoanStatusHistoryResponse = z.infer<
  typeof loanStatusHistoryResponseSchema
>
export type LoanPaymentResponse = z.infer<typeof loanPaymentResponseSchema>
export type RegisterLoanPaymentRequest = z.infer<
  typeof registerLoanPaymentRequestSchema
>
export type LoansPageResponse = z.infer<typeof loansPageResponseSchema>
export type LoanStatusHistoryPageResponse = z.infer<
  typeof loanStatusHistoryPageResponseSchema
>
export type LoanPaymentsPageResponse = z.infer<typeof loanPaymentsPageResponseSchema>
