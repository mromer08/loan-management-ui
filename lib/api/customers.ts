import {
  createCustomerRequestSchema,
  customerResponseSchema,
  customersPageResponseSchema,
  type CreateCustomerRequest,
  updateCustomerRequestSchema,
  type UpdateCustomerRequest,
} from "@/lib/schemas/customer"
import { z } from "zod"
import { apiFetch } from "@/lib/api/client"

export async function createCustomer(input: CreateCustomerRequest) {
  const payload = createCustomerRequestSchema.parse(input)

  return apiFetch({
    path: "/api/v1/customers",
    schema: customerResponseSchema,
    init: {
      method: "POST",
      body: JSON.stringify(payload),
    },
  })
}

export async function getCustomerById(customerId: string) {
  return apiFetch({
    path: `/api/v1/customers/${customerId}`,
    schema: customerResponseSchema,
    init: {
      cache: "no-store",
    },
  })
}

export async function updateCustomer(customerId: string, input: UpdateCustomerRequest) {
  const payload = updateCustomerRequestSchema.parse(input)

  return apiFetch({
    path: `/api/v1/customers/${customerId}`,
    schema: customerResponseSchema,
    init: {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  })
}

export async function deleteCustomer(customerId: string) {
  await apiFetch({
    path: `/api/v1/customers/${customerId}`,
    schema: z.unknown(),
    init: {
      method: "DELETE",
    },
  })
}

export async function getCustomers(params?: {
  searchTerm?: string
  page?: number
  size?: number
}) {
  const searchParams = new URLSearchParams()

  if (params?.searchTerm) {
    searchParams.set("searchTerm", params.searchTerm)
  }

  if (typeof params?.page === "number") {
    searchParams.set("page", String(params.page))
  }

  if (typeof params?.size === "number") {
    searchParams.set("size", String(params.size))
  }

  const query = searchParams.toString()
  const path = query
    ? `/api/v1/customers?${query}`
    : "/api/v1/customers"

  return apiFetch({
    path,
    schema: customersPageResponseSchema,
    init: {
      cache: "no-store",
    },
  })
}
