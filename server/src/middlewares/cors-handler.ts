//* package imports
import cors, { CorsOptions } from "cors"

//* file imports
import { env } from "@/configs/env"

const allowedOrigins = (env.ALLOWED_URLS || '')
    .split(',')
    .map(url => url.trim());

// console.log("Loaded ALLOWED_URLS:", process.env.ALLOWED_URLS);
// console.log("Allowed origins array:", allowedOrigins);

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const normalizedOrigin = origin.toLowerCase().replace(/\/$/, "");

        const isAllowed = allowedOrigins.some(o =>
            o.toLowerCase().replace(/\/$/, "") === normalizedOrigin
        );

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked for origin: ${origin}`));
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
};


export const corsMiddleware = cors(corsOptions)
