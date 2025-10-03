//* package imports 
import { z } from "zod"

const resetPasswordSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
    password: z.string().min(1, { message: "Old password is required" }),
    newPassword: z
        .string()
        .min(8, { message: "New password must be at least 8 characters long" }),
})

type resetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export {
    resetPasswordSchema,
    type resetPasswordFormValues
}