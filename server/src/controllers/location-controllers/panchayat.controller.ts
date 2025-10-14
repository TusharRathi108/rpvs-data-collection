//* package imports
import { Request, Response } from "express"

//* file imports
import { env } from "@/configs/env"
import { handleError, successHandler } from "@/globals/response-handler.helper"
import { CreatePancahaytDto, CreatePanchayatSchema, UpdatePanchayatDto, UpdatePanchayatSchema } from "@/schemas/panchayat.schema"
import { SessionUser } from "@/types/session-user"
import { ExceptionType, throwHttpException } from "@/utils/http-exception"
import { toObjectId } from "@/utils/utility-functions"

//* model imports
import { PanchayatModel } from "@/models/location-models/panchayat.model"

const createPanchayat = async (request: Request, response: Response) => {
    try {
        const user = request.user as SessionUser
        const parsedPayload: CreatePancahaytDto = CreatePanchayatSchema.parse(request.body)

        const latest = await PanchayatModel
            .findOne({ panchayat_code: { $regex: /^TEMP-\d{6}$/ } })
            .sort({ panchayat_code: -1 })
            .select({ panchayat_code: 1, _id: 0 })
            .lean<{ panchayat_code?: string }>()

        const latestCode: string = latest?.panchayat_code ?? ""

        let nextCodeNum = 1

        const match = /^TEMP-(\d{6})$/.exec(latestCode)

        if (match) {
            nextCodeNum = Number(match[1]) + 1
        }

        const newPanchayatCode = `TEMP-${nextCodeNum.toString().padStart(6, "0")}`

        const result = await PanchayatModel.create({
            ...parsedPayload,
            panchayat_code: newPanchayatCode,
            createdBy: toObjectId(user.user_id),
            updatedBy: toObjectId(user.user_id),
            lastActionBy: toObjectId(user.user_id)
        })

        return successHandler({
            response,
            records: result,
            message: env.DEF_SUCCESS_MESSAGE,
            status: true,
            httpCode: 200
        })
    } catch (error) {
        console.log("ERROR", error)
        return handleError(error, response)
    }
}

const fetchAllPanchayats = async (request: Request, response: Response) => {
    try {
        // const { district_code } = request.query as { district_code: string }
        const result = await PanchayatModel.find().sort({ createdAt: -1 }).lean()

        return successHandler({
            response,
            records: result,
            message: env.DEF_SUCCESS_MESSAGE,
            status: true,
            httpCode: 200
        })
    } catch (error) {
        console.log(error)
        return handleError(error, response)
    }
}

const updatePanchayat = async (request: Request, response: Response) => {
    try {
        const user = request.user as SessionUser
        const { panchayat_id } = request.params as { panchayat_id: string }

        const exists = await PanchayatModel.findById(panchayat_id)

        if (!exists) throwHttpException(ExceptionType.NotFound, "Panchayat does not exists!")

        const parsedPayload: UpdatePanchayatDto = UpdatePanchayatSchema.parse(request.body)

        const result = await PanchayatModel.findByIdAndUpdate(
            panchayat_id,
            {
                panchayat_name: parsedPayload.panchayat_name,
                updatedBy: toObjectId(user.user_id),
                lastActionBy: toObjectId(user.user_id)
            })

        return successHandler({
            response,
            records: result,
            message: env.DEF_SUCCESS_MESSAGE,
            status: true,
            httpCode: 200
        })
    } catch (error) {
        console.log("ERROR", error)
        return handleError(error, response)
    }
}

export {
    createPanchayat, fetchAllPanchayats, updatePanchayat
}
