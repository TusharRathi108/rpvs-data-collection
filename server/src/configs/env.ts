//* package imports
import { z, object } from "zod"

const EnvSchema = object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    SERVER_PORT: z.string(),

    ALLOWED_URLS: z.string(),

    MONGO_DB_URI: z.string(),

    DEF_SUCCESS_MESSAGE: z.string(),

    SESSION_SECRET: z.string()
})

export const env = EnvSchema.parse(process.env);
