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

export { ensureAuthenticated }
