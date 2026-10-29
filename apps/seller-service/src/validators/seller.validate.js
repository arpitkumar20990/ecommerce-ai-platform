import {z} from 'zod'

export const applySellerSchema = z.object({
    storeName : z
        .string()
        .trim()
        .min(3, "Store name must be atleast 3 characters")
        .max(60, "Store name cannot exceed 60 charater"),

        description: z
        .string()
        .trim()
        .max(500, "Description cannot excced 500 character")
        .optional()
        
}).strict();

export const updateSellerSchema = z.object({
    storeName: z
        .string()
        .trim()
        .min(3,"Store name must be atleast 3 character")
        .max(60, "Store name cannot exceed 60 characters")
        .optional(),
    description: z
        .string()
        .trim()
        .max(500, "Description must not exceeed 500 characters")
        .nullable()
        .optional()
}).strict().refine(
    (data)=> Object.keys(data).length > 0,
    {
        message : "At least one field is required"
    }
)