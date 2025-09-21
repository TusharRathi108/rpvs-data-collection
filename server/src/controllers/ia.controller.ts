//* package imports 
import { Request, Response } from 'express'

//* file imports
import { env } from '@/configs/env'
import { SessionUser } from '@/types/session-user'
import { handleError, successHandler } from '@/globals/response-handler.helper'
import { toObjectId } from '@/utils/utility-functions'
import { CreateImplementationAgencyDto, CreateImplementationAgencySchema, UpdateImplementationAgencyDto, UpdateImplementationAgencySchema } from '@/schemas/ia.schema'
import { ImplementationAgencyModel } from '@/models/ia.model'
import { ExceptionType, throwHttpException } from '@/utils/http-exception'

const createImplementationAgency = async (request: Request, response: Response) => {
    try {
        const user = request.user as SessionUser

        const parsedData: CreateImplementationAgencyDto = CreateImplementationAgencySchema.parse(request.body);

        const result = await ImplementationAgencyModel.create({
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
        })
    } catch (error) {
        console.log('Error: ', error)
        return handleError(error, response)
    }
}

const fetchImplementationAgencies = async (request: Request, response: Response) => {
    try {
        // const user = request.user as SessionUser

        const result = await ImplementationAgencyModel.find({
            isDeleted: false,
        }).lean();

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

const fetchImplemenationAgencyDistrictWise = async (request: Request, response: Response) => {
    try {
        // const user = request.user as SessionUser
        const { district_id } = request.params as { district_id: string }

        if (!toObjectId(district_id)) {
            throwHttpException(ExceptionType.BadRequest, "Invalid District ID!")
        }

        const result = await ImplementationAgencyModel.find({
            district_id: toObjectId(district_id),
            isDeleted: false
        })

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

const updateImplementationAgency = async (request: Request, response: Response) => {
    try {
        const user = request.user as SessionUser
        const { agency_id } = request.params as { agency_id: string }

        if (!toObjectId(agency_id)) {
            throwHttpException(ExceptionType.Conflict, "Invalid implementation agency ID")
        }

        const parsedData: UpdateImplementationAgencyDto = UpdateImplementationAgencySchema.parse(request.body);

        const result = await ImplementationAgencyModel.findByIdAndUpdate(
            { _id: toObjectId(agency_id) },
            {
                ...parsedData,
                updatedBy: toObjectId(user.user_id),
                lastActionTakenBy: toObjectId(user.user_id),
            },
            { new: true }
        );

        if (!result) {
            throwHttpException(ExceptionType.NotFound, "Implementation Agency not found")
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
    createImplementationAgency,
    updateImplementationAgency,
    fetchImplementationAgencies,
    fetchImplemenationAgencyDistrictWise,
}
