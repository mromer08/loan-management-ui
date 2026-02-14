import { z } from "zod"

const todayISO = () => new Date().toISOString().slice(0, 10)

export const createCustomerRequestSchema = z.object({
  firstName: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(50, "El nombre no puede tener mas de 50 caracteres"),
  lastName: z.string().trim().min(2, "El apellido debe tener al menos 2 caracteres").max(50, "El apellido no puede tener mas de 50 caracteres"),
  identificationNumber: z
    .string()
    .trim()
    .regex(/^\d{13}$/, "La identificacion debe tener exactamente 13 digitos"),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener formato YYYY-MM-DD")
    .refine((value) => value < todayISO(), "La fecha de nacimiento debe ser en el pasado"),
  address: z.string().trim().min(1, "La direccion es obligatoria").max(255, "La direccion no puede tener mas de 255 caracteres"),
  email: z.string().trim().email("Correo electronico invalido").max(150, "El correo no puede tener mas de 150 caracteres"),
  phone: z.string().trim().regex(/^\d{8}$/, "El telefono debe tener exactamente 8 digitos"),
})

export const updateCustomerRequestSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener mas de 50 caracteres")
    .optional(),
  lastName: z
    .string()
    .trim()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede tener mas de 50 caracteres")
    .optional(),
  identificationNumber: z
    .string()
    .trim()
    .regex(/^\d{13}$/, "La identificacion debe tener exactamente 13 digitos")
    .optional(),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener formato YYYY-MM-DD")
    .refine((value) => value < todayISO(), "La fecha de nacimiento debe ser en el pasado")
    .optional(),
  address: z
    .string()
    .trim()
    .max(255, "La direccion no puede tener mas de 255 caracteres")
    .optional(),
  email: z
    .string()
    .trim()
    .email("Correo electronico invalido")
    .max(150, "El correo no puede tener mas de 150 caracteres")
    .optional(),
  phone: z
    .string()
    .trim()
    .regex(/^\d{8}$/, "El telefono debe tener exactamente 8 digitos")
    .optional(),
})

export const customerResponseSchema = z.object({
  id: z.uuid(),
  firstName: z.string(),
  lastName: z.string(),
  identificationNumber: z.string(),
  birthDate: z.string(),
  address: z.string(),
  email: z.string(),
  phone: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createPagedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z
    .object({
      data: z.array(itemSchema),
      totalElements: z.number().int().nonnegative(),
      pageNumber: z.number().int().nonnegative(),
      totalPages: z.number().int().nonnegative(),
      isFirst: z.boolean(),
      isLast: z.boolean(),
      hasNext: z.boolean(),
      hasPrevious: z.boolean(),
    })

export const customersPageResponseSchema = createPagedResponseSchema(
  customerResponseSchema
)

export type CreateCustomerRequest = z.infer<typeof createCustomerRequestSchema>
export type UpdateCustomerRequest = z.infer<typeof updateCustomerRequestSchema>
export type CustomerResponse = z.infer<typeof customerResponseSchema>
export type CustomersPageResponse = z.infer<typeof customersPageResponseSchema>
