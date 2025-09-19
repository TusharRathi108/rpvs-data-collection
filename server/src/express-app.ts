//* package imports
import session from "express-session";
import cookieParser from "cookie-parser";
import express, { Express, json, urlencoded } from "express";

//* file imports
import { env } from "@/configs/env";
import authRouter from "@/routes/auth.route";
import adminRouter from "@/routes/admin.route";
import passport from "./globals/passport-service";
import { corsMiddleware } from "@/middlewares/cors-handler";
import { ensureAuthenticated } from "@/middlewares/authentication";

//? initialize express application 
const expressApp: Express = express();

// * initialize middlewares
expressApp.use(urlencoded({ extended: true }))
expressApp.use(json())
expressApp.use(cookieParser())
expressApp.use(corsMiddleware)

expressApp.use(
    session({
        secret: env.SESSION_SECRET || "super-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60
        }
    })
);
expressApp.use(passport.initialize());
expressApp.use(passport.session());

expressApp.use((request, response, next) => {
    const start = Date.now()
    response.on("finish", () => {
        const duration = Date.now() - start
        console.log(`⏱️ [${request.method}] ${request.originalUrl} - ${duration}ms`)
    })
    next()
})

//* initialize routes
expressApp.use("/api/v1/auth", authRouter);
expressApp.use("/api/v1", ensureAuthenticated, adminRouter)

export default expressApp;
