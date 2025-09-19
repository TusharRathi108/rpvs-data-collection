//* package imports
import { Request, Response } from "express"

//* file imports
import { env } from "@/configs/env";
import { RoleModel } from "@/models/role.model"
import { CreateRoleSchema } from "@/schemas/role.schema";
import { handleError, successHandler } from "@/globals/response-handler.helper"

const createRoleController = async (request: Request, response: Response) => {
    try {
        const parsedData = CreateRoleSchema.parse(request.body);

        const data = await RoleModel.create(parsedData);

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

export { createRoleController }
