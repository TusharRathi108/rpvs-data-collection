//* package imports
import { Router, Request, Response } from "express";

//* file imports
import { UserModel } from "@/models/user.model";
import { verifyPassword, hashPassword } from "@/utils/password";
import { successHandler } from "@/globals/response-handler.helper";
import { ExceptionType, throwHttpException } from "@/utils/http-exception";

const resetRouter: Router = Router();

resetRouter.post("/password", async (req: Request, res: Response) => {
    try {
        const { username, password, newPassword } = req.body;

        if (!username || !password || !newPassword) {
            throwHttpException(ExceptionType.BadRequest, "All fields are required");
        }

        const user = await UserModel.findOne({ username }).exec();
        if (!user) {
            throwHttpException(ExceptionType.NotFound, "User not found");
        }

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            throwHttpException(ExceptionType.Unauthorized, "Invalid old password");
        }

        user.password = await hashPassword(newPassword);
        user.password_reset = true;
        await user.save();

        return successHandler({
            response: res,
            records: { username: user.username, password_reset: true },
            message: "✅ Password reset successfully. Please login again.",
            status: true,
            httpCode: 200,
        });
    } catch (error: any) {
        return res.status(error.httpCode || 500).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
});

export default resetRouter;
