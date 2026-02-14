import { apiFetch } from "@/lib/api/client"
import {
  loanPaymentResponseSchema,
  loanPaymentsPageResponseSchema,
  loanResponseSchema,
  loanStatusHistoryPageResponseSchema,
  loansPageResponseSchema,
  registerLoanPaymentRequestSchema,
  reviewLoanApplicationRequestSchema,
  type RegisterLoanPaymentRequest,
  submitLoanApplicationRequestSchema,
  type ReviewLoanApplicationRequest,
  type SubmitLoanApplicationRequest,
} from "@/lib/schemas/loan"

type GetCustomerLoansParams = {
  status?: string
  page?: number
  size?: number
}

type PageParams = {
  page?: number
  size?: number
}

function toQueryString(params?: GetCustomerLoansParams | PageParams) {
  const searchParams = new URLSearchParams()

  if (!params) {
    return ""
  }

  if ("status" in params && typeof params.status === "string") {
    const normalizedStatus = params.status.trim()
    if (normalizedStatus.length > 0) {
      searchParams.set("status", normalizedStatus)
    }
  }

  if (typeof params.page === "number") {
    searchParams.set("page", String(params.page))
  }

  if (typeof params.size === "number") {
    searchParams.set("size", String(params.size))
  }

  return searchParams.toString()
}

export async function getLoanApplicationsByCustomer(
  customerId: string,
  params?: GetCustomerLoansParams
) {
  const query = toQueryString(params)
  const path = query
    ? `/api/v1/customers/${customerId}/loans?${query}`
    : `/api/v1/customers/${customerId}/loans`

  return apiFetch({
    path,
    schema: loansPageResponseSchema,
    init: {
      cache: "no-store",
    },
  })
}

export async function getLoanById(loanId: string) {
  return apiFetch({
    path: `/api/v1/loans/${loanId}`,
    schema: loanResponseSchema,
    init: {
      cache: "no-store",
    },
  })
}

export async function getLoanStatusHistory(loanId: string, params?: PageParams) {
  const query = toQueryString(params)
  const path = query
    ? `/api/v1/loans/${loanId}/history?${query}`
    : `/api/v1/loans/${loanId}/history`

  return apiFetch({
    path,
    schema: loanStatusHistoryPageResponseSchema,
    init: {
      cache: "no-store",
    },
  })
}

export async function getLoanPayments(loanId: string, params?: PageParams) {
  const query = toQueryString(params)
  const path = query
    ? `/api/v1/loans/${loanId}/payments?${query}`
    : `/api/v1/loans/${loanId}/payments`

  return apiFetch({
    path,
    schema: loanPaymentsPageResponseSchema,
    init: {
      cache: "no-store",
    },
  })
}

export async function submitLoanApplication(
  customerId: string,
  input: SubmitLoanApplicationRequest
) {
  const payload = submitLoanApplicationRequestSchema.parse(input)

  return apiFetch({
    path: `/api/v1/customers/${customerId}/loans`,
    schema: loanResponseSchema,
    init: {
      method: "POST",
      body: JSON.stringify(payload),
    },
  })
}

export async function approveLoanApplication(
  loanId: string,
  input: ReviewLoanApplicationRequest
) {
  const payload = reviewLoanApplicationRequestSchema.parse(input)

  return apiFetch({
    path: `/api/v1/loans/${loanId}/approve`,
    schema: loanResponseSchema,
    init: {
      method: "POST",
      body: JSON.stringify(payload),
    },
  })
}

export async function rejectLoanApplication(
  loanId: string,
  input: ReviewLoanApplicationRequest
) {
  const payload = reviewLoanApplicationRequestSchema.parse(input)

  return apiFetch({
    path: `/api/v1/loans/${loanId}/reject`,
    schema: loanResponseSchema,
    init: {
      method: "POST",
      body: JSON.stringify(payload),
    },
  })
}

export async function registerLoanPayment(
  loanId: string,
  input: RegisterLoanPaymentRequest
) {
  const payload = registerLoanPaymentRequestSchema.parse(input)

  return apiFetch({
    path: `/api/v1/loans/${loanId}/payments`,
    schema: loanPaymentResponseSchema,
    init: {
      method: "POST",
      body: JSON.stringify(payload),
    },
  })
}
