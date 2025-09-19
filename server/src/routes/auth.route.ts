//* package imports
import { Router, Request, Response } from "express";

//* file imports
import passport from "@/globals/passport-service";
import { successHandler } from "@/globals/response-handler.helper";
import { env } from "@/configs/env";

//* initialise router
const authRouter: Router = Router();

authRouter.post(
    "/login",
    passport.authenticate("local"),
    (request: Request, response: Response) => {
        return successHandler({
            response,
            records: request.user,
            message: env.DEF_SUCCESS_MESSAGE,
            status: true,
            httpCode: 200
        })
    }
);

authRouter.get("/me", (request: Request, response: Response) => {
    if (request.isAuthenticated && request.isAuthenticated()) {
        return successHandler({
            response,
            records: request.user,
            message: env.DEF_SUCCESS_MESSAGE,
            status: true,
            httpCode: 200
        })
    }
    return successHandler({
        response,
        records: null,
        message: "❌ Not logged in",
        status: false,
        httpCode: 401
    });
});

authRouter.post("/logout", (request: Request, response: Response, next) => {
    request.logout(error => {
        if (error) return next(error);
        return successHandler({
            response,
            records: null,
            message: "👋 Logged out successfully",
            status: true,
            httpCode: 200
        })
    });
});

export default authRouter;