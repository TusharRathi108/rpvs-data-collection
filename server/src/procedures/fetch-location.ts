//* package imports
import { Request, Response } from "express"
import { Model, FilterQuery } from "mongoose"

//* file imports
import { env } from "@/configs/env"
import { handleError, successHandler } from "@/globals/response-handler.helper"

//* reusable function
const fetchLocation = async <T>(
    request: Request,
    response: Response,
    model: Model<T>,
    extraFilters: (query: any) => FilterQuery<T> = () => ({})
) => {
    try {
        const filters: FilterQuery<T> = {
            isActive: true,
            ...extraFilters(request.query),
        }

        const result = await model.find(filters)

        return successHandler({
            response,
            records: result,
            message: env.DEF_SUCCESS_MESSAGE,
            status: true,
            httpCode: 200,
        })
    } catch (error) {
        console.error("Error: ", error)
        return handleError(error, response)
    }
}

export { fetchLocation }
