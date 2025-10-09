//* package imports 
import { Request, Response } from "express";

//*file imports
import { SessionUser } from "@/types/session-user";
import { toObjectId } from "@/utils/utility-functions";
import { DepartmentModel } from "@/models/department.model";
import { handleError, successHandler } from "@/globals/response-handler.helper";
import { CreateDepartmentSchema, UpdateDepartmentSchema } from "@/schemas/department.schema";
import { env } from "@/configs/env";
import { ExceptionType, throwHttpException } from "@/utils/http-exception";

const createDepartment = async (request: Request, response: Response) => {
    try {
        const user = request.user as SessionUser

        const parsedData = CreateDepartmentSchema.parse(request.body);

        const result = await DepartmentModel.create({
            ...parsedData,
            createdBy: toObjectId(user.user_id),
            updatedBy: toObjectId(user.user_id),
            lastActionTakenBy: toObjectId(user.user_id),
        });

        return successHandler({
            response,
            records: result,
            message: env.DEF_SUCCESS_MESSAGE,
            status: true,
            httpCode: 200
        });
    } catch (error) {
        console.log('Error: ', error)
        return handleError(error, response)
    }
}

const fetchDepartments = async (request: Request, response: Response) => {
    try {
        const result = await DepartmentModel.find({ isDeleted: false }).sort({ createdAt: -1 })
            .lean();

        successHandler({
            response,
            records: result,
            message: env.DEF_SUCCESS_MESSAGE,
            status: true,
            httpCode: 200
        });
    } catch (error) {
        console.log('Error: ', error)
        return handleError(error, response)
    }
}

const updateDepartment = async (request: Request, response: Response) => {
    try {
        const user = request.user as SessionUser
        const { department_id } = request.params as { department_id: string }

        if (!toObjectId(department_id)) {
            throwHttpException(ExceptionType.Conflict, "Invalid department id!")
        }

        const parsedData = UpdateDepartmentSchema.parse(request.body);

        const result = await DepartmentModel.findByIdAndUpdate(
            { _id: toObjectId(department_id) },
            {
                ...parsedData,
                updatedBy: toObjectId(user.user_id),
                lastActionTakenBy: toObjectId(user.user_id),
            },
            { new: true }
        );

        if (!result) {
            throwHttpException(ExceptionType.NotFound, "Department not found")
        }

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

export {
    createDepartment,
    fetchDepartments,
    updateDepartment
}
