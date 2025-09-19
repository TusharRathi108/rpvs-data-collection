//* package imports
import cors, { CorsOptions } from "cors"

//* file imports
import { env } from "@/configs/env"

const allowedOrigins = (env.ALLOWED_URLS || '')
    .split(',')
    .map(url => url.trim());

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error(`CORS blocked for origin: ${origin}`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}

export const corsMiddleware = cors(corsOptions)
