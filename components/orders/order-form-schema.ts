import { z } from "zod";

export const orderFormSchema = z.object({
  buyerId: z.string().min(1, "Buyer is required."),

  programmeName: z
    .string()
    .trim()
    .min(1, "Programme is required."),

  poNumber: z
    .string()
    .trim()
    .optional(),

  styleNumber: z
    .string()
    .trim()
    .min(1, "Style number is required."),

  color: z
    .string()
    .trim()
    .min(1, "Color is required."),

  factory: z
    .string()
    .trim()
    .optional(),

  qtySet: z.number().int().min(0).optional(),

  qtyPiece: z.number().int().min(0).optional(),

  actualPrice: z.number().min(0).optional(),

  factoryPrice: z.number().min(0).optional(),

  shipDate: z.string().optional(),

  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "IN_PRODUCTION",
    "READY_TO_SHIP",
    "SHIPPED",
    "COMPLETED",
    "CANCELLED",
  ]),

  remarks: z
    .string()
    .trim()
    .optional(),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;