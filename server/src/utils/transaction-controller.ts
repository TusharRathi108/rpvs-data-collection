//* package imports
import mongoose, { ClientSession } from "mongoose";
import { Request, Response, NextFunction } from "express";

type ControllerFn = (
    req: Request,
    res: Response,
    next: NextFunction,
    session: ClientSession
) => Promise<any>;

export function withTransaction(controller: ControllerFn) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await controller(req, res, next, session);

            await session.commitTransaction();
        } catch (err) {
            await session.abortTransaction();
            next(err);
        } finally {
            session.endSession();
        }
    };
}