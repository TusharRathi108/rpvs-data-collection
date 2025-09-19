//* package imports
import { z } from "zod"

const LoginSchema = z.object({
    username: z.string({ error: "Username is required!" }),
    password: z.string().min(1, { error: "Password is required!" })
})

export { LoginSchema }
