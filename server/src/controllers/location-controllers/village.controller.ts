//* package imports
import { Request, Response } from "express"

//* file imports
import { env } from "@/configs/env"
import { SessionUser } from "@/types/session-user"
import { toObjectId } from "@/utils/utility-functions"
import { ExceptionType, throwHttpException } from "@/utils/http-exception"
import { handleError, successHandler } from "@/globals/response-handler.helper"
import { CreateVillageDto, CreateVillageSchema, UpdateVillageDto, UpdateVillageSchema } from "@/schemas/village.schema"

//* model imports
import { PanchayatVillageModel } from "@/models/location-models/village.model"

const createVillage = async (request: Request, response: Response) => {
    try {
        const user = request.user as SessionUser
        const parsedPayload: CreateVillageDto = CreateVillageSchema.parse(request.body)

        const latest = await PanchayatVillageModel
            .findOne({ village_code: { $regex: /^TEMP-\d{6}$/ } })
            .sort({ village_code: -1 })
            .select({ village_code: 1, _id: 0 })
            .lean<{ village_code?: string }>()

        const latestCode: string = latest?.village_code ?? ""

        let nextCodeNum = 1

        const match = /^TEMP-(\d{6})$/.exec(latestCode)

        if (match) {
            nextCodeNum = Number(match[1]) + 1
        }

        const newVillageCode = `TEMP-${nextCodeNum.toString().padStart(6, "0")}`

        const hadbastVillageName = `${parsedPayload.village_name} (${parsedPayload.hadbast_number})`

        const result = await PanchayatVillageModel.create({
            ...parsedPayload,
            village_code: newVillageCode,
            hadbast_village_name: hadbastVillageName,
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
        console.log("Error: ", error)
        return handleError(error, response)
    }
}

const fetchAllVillages = async (request: Request, response: Response) => {
    try {
        const records = await PanchayatVillageModel.find({ isActive: true }).sort({ createdAt: -1 }).lean()

        return successHandler({
            response,
            records,
            message: env.DEF_SUCCESS_MESSAGE,
            status: true,
            httpCode: 200
        })
    } catch (error) {
        console.log(error)
        return handleError(error, response)
    }
}

const updateVillage = async (request: Request, response: Response) => {
    try {
        const user = request.user as SessionUser
        const { village_id } = request.params as { village_id: string }

        const exists = await PanchayatVillageModel.findById(village_id)

        if (!exists) throwHttpException(ExceptionType.NotFound, "Village does not exists!")

        const parsedPayload: UpdateVillageDto = UpdateVillageSchema.parse(request.body)

        const hadbastVillageName = `${parsedPayload.village_name} (${parsedPayload.hadbast_number})`

        const result = await PanchayatVillageModel.findByIdAndUpdate(
            village_id,
            {
                hadbast_village_name: hadbastVillageName,
                village_name: parsedPayload.village_name,
                hadbast_number: parsedPayload.hadbast_number,
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
        console.log("Error: ", error)
        return handleError(error, response)
    }
}

export {
    fetchAllVillages,
    createVillage,
    updateVillage
}
