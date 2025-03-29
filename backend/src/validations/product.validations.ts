import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(1, "Description is required").max(500),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().int().nonnegative("Quantity must be zero or positive"),
  category_id: z.string().uuid("Invalid category ID").nullable(),
  sku: z.string().max(50).optional(),
  barcode: z.string().max(50).optional(),
  weight: z.number().positive("Weight must be positive").optional(),
  dimensions: z.string().max(50).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().uuid().optional(),
  sort: z.enum(['name', 'price', 'quantity', 'created_at']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional()
});