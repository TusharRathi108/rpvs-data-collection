//* package imports
import { Request, Response } from "express"

//* file imports
import { env } from "@/configs/env";
import { MlaModel } from "@/models/mla.model";
import { hashPassword } from "@/utils/password";
import { UserModel } from "@/models/user.model";
import { CreateUserSchema } from "@/schemas/user.schema";
import { handleError, successHandler } from "@/globals/response-handler.helper"
import { ExceptionType, throwHttpException } from "@/utils/http-exception";

const createUserController = async (request: Request, response: Response) => {
    try {
        const parsedData = CreateUserSchema.parse(request.body);

        const existingUser = await UserModel.findOne({
            $or: [{ email: parsedData.email }, { username: parsedData.username }]
        });

        if (existingUser) {
            throwHttpException(ExceptionType.Conflict, "User already exists with this email or username")
        }

        parsedData.password = await hashPassword(parsedData?.password || "");

        const data = await UserModel.create(parsedData);

        return successHandler({
            response,
            records: data,
            message: env.DEF_SUCCESS_MESSAGE,
            status: true,
            httpCode: 200
        })
    } catch (error) {
        console.log('Error: ', error)
        return handleError(error, response)
    }
}

const fetchMla = async (request: Request, response: Response) => {
    try {
        const result = await MlaModel.find()

        return successHandler({
            response,
            records: result,
            message: env.DEF_SUCCESS_MESSAGE,
            status: true,
            httpCode: 200
        })
    } catch (error) {
        console.log('Error: ', error)
        return handleError(error, response)
    }
}

export { createUserController, fetchMla }
