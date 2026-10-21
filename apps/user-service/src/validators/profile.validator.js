import {z} from 'zod'

export const profileSchema = z.object({
    firstName : z.string().trim().min(1).max(50).optional(),
    lastName : z.string().trim().min(1).max(50).optional(),
    phone : z.string().trim().min(10).max(15).optional(),
    avatarUrl : z.string().url().optional()
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    { message : "At least one profile field is required"}
)