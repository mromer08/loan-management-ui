import { z, ZodType } from "zod"

import { API_BASE_URL } from "@/lib/env"

type ApiFetchOptions<TSchema extends ZodType> = {
  path: string
  schema: TSchema
  init?: RequestInit
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly detail?: string,
    public readonly title?: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

function buildUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

export async function apiFetch<TSchema extends ZodType>({
  path,
  schema,
  init,
}: ApiFetchOptions<TSchema>) {
  const response = await fetch(buildUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    const fallbackMessage = `Error en solicitud (${response.status})`
    let message = fallbackMessage
    let detail: string | undefined
    let title: string | undefined

    try {
      const json = (await response.json()) as {
        detail?: string
        title?: string
        message?: string
      }

      detail = json.detail
      title = json.title
      message = json.detail ?? json.title ?? json.message ?? fallbackMessage
    } catch {
      // Keep fallback message when server does not return JSON.
    }

    throw new ApiError(message, response.status, detail, title)
  }

  // Some endpoints (e.g. DELETE) can return 204 No Content.
  if (response.status === 204) {
    return undefined as z.infer<TSchema>
  }

  const json = await response.json()
  return schema.parse(json)
}
