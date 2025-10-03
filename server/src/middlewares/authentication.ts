//* package imports
import { Request, Response, NextFunction } from "express";

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({
        success: false,
        message: "❌ Unauthorized. Please log in."
    });
}

function ensurePasswordReset(req: Request, res: Response, next: NextFunction) {
    if (
        req.isAuthenticated &&
        req.isAuthenticated() &&
        (req.user as any)?.password_reset
    ) {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: "⚠️ You must reset your password before accessing other routes.",
    });
}

export { ensureAuthenticated, ensurePasswordReset }
