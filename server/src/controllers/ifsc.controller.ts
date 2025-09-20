//* package imports
import { Request, Response } from "express";

//* file imports
import IfscCodeModel from "@/models/ifsc.model";
import { successHandler, handleError } from "@/globals/response-handler.helper";
import { toObjectId } from "@/utils/utility-functions";
import { env } from "@/configs/env";

const fetchIfscCodes = async (request: Request, response: Response) => {
    try {
        const { district_id } = request.params as { district_id: string }

        const result = await IfscCodeModel.find({ district_id: toObjectId(district_id), isDeleted: false })

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
    fetchIfscCodes
}
