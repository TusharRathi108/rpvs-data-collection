//* package imports
import { PipelineStage } from "mongoose";
import { Request, Response } from "express"

//* file imports
import { env } from "@/configs/env";
import { SessionUser } from "@/types/session-user";
import { toObjectId } from "@/utils/utility-functions";
import { BankMasterModel } from "@/models/bank-head.model";
import { ExceptionType, throwHttpException } from "@/utils/http-exception";
import { handleError, successHandler } from "@/globals/response-handler.helper"
import { CreateBankHeadDto, createBankHeadSchema, UpdateBankHeadDto, updateBankHeadSchema } from "@/schemas/bank-head.schema";

const createBankHead = async (request: Request, response: Response) => {
    try {
        const user = request.user as SessionUser;
        const role_name = user?.role_name ?? "";

        const parsedPayload: CreateBankHeadDto = createBankHeadSchema(role_name).parse(request.body);

        const payloadWithAudit = {
            ...parsedPayload,
            createdBy: toObjectId(user?.user_id),
            updatedBy: toObjectId(user?.user_id),
            lastActionTakenBy: toObjectId(user?.user_id),
        };

        const result = await BankMasterModel.create(payloadWithAudit);

        return successHandler({
            response,
            records: result,
            message: env.DEF_SUCCESS_MESSAGE,
            status: true,
            httpCode: 200,
        });
    } catch (error) {
        console.log("Error: ", error);
        return handleError(error, response);
    }
};

const fetchBankDetails = async (request: Request, response: Response) => {
    try {
        const user = request.user as SessionUser;
        const { agency_details } = request.query as { agency_details: string };

        const baseProject = {
            _id: 1,
            district_id: 1,
            district_code: 1,
            district_name: 1,
            bank_name: 1,
            account_number: 1,
            ifsc_code: 1,
            branch_name: 1,
            branch_code: 1,
            rbo: 1,
            branch_manager_name: 1,
            contact_number: 1,
            remarks: 1,
        };

        const pipeline: PipelineStage[] = [
            {
                $match: {
                    isDeleted: false,
                    ...(agency_details === "true"
                        ? { agency_id: { $ne: null } }
                        : { agency_id: null }),
                },
            },
            {
                $project:
                    user.role_name === "PLANNING"
                        ? baseProject
                        : {
                            ...baseProject,
                            agency_id: 1,
                            agency_name: 1,
                        },
            },
        ];


        const result = await BankMasterModel.aggregate(pipeline);

        return successHandler({
            response,
            records: result,
            message: "Bank heads fetched successfully",
            status: true,
            httpCode: 200,
        });
    } catch (error) {
        console.error("Error: ", error);
        return handleError(error, response);
    }
};

const fetchAgencyBankDetails = async (request: Request, response: Response) => {
    try {
        const user = request.user as SessionUser
        const { bank_head_id } = request.params;

        if (!bank_head_id) {
            throwHttpException(ExceptionType.NotFound, "Bank Head ID is required");
        }

        if (!toObjectId(bank_head_id)) {
            throwHttpException(ExceptionType.NotFound, "Invalid Bank Head ID");
        }

        const pipeline: PipelineStage[] = [
            {
                $match: {
                    _id: toObjectId(bank_head_id),
                    isActive: true,
                },
            },
        ];

        if (user.role_name === "PLANNING") {
            pipeline.push({
                $project: {
                    _id: 1,
                    district_id: 1,
                    district_code: 1,
                    district_name: 1,
                    bank_name: 1,
                    account_number: 1,
                    ifsc_code: 1,
                    branch_name: 1,
                    branch_code: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            });
        } else {
            pipeline.push({
                $project: {
                    _id: 1,
                    district_id: 1,
                    district_code: 1,
                    district_name: 1,
                    agncy_id: 1,
                    agency_name: 1,
                    bank_name: 1,
                    account_number: 1,
                    ifsc_code: 1,
                    branch_name: 1,
                    branch_code: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            });
        }

        const result = await BankMasterModel.aggregate(pipeline);

        return successHandler({
            response,
            records: result[0] || null,
            message: "Bank head fetched successfully",
            status: true,
            httpCode: 200,
        });
    } catch (error) {
        console.error("Error: ", error);
        return handleError(error, response);
    }
}

const updateBankHead = async (request: Request, response: Response) => {
    try {
        const user = request.user as SessionUser;
        const { bank_head_id } = request.params as { bank_head_id: string }

        if (!bank_head_id) {
            throwHttpException(ExceptionType.BadRequest, "Bank Head ID is required");
        }

        const role_name = user?.role_name ?? "";

        const parsedPayload: UpdateBankHeadDto = updateBankHeadSchema(role_name).parse(
            request.body
        );

        const existing = await BankMasterModel.findOne({
            _id: toObjectId(bank_head_id),
            isDeleted: false,
        });

        if (!existing) {
            throwHttpException(ExceptionType.NotFound, "Bank Head not found");
        }

        const payloadWithAudit = {
            ...parsedPayload,
            updatedBy: toObjectId(user?.user_id),
            lastActionTakenBy: toObjectId(user?.user_id),
        };

        const result = await BankMasterModel.findByIdAndUpdate(
            { _id: bank_head_id },
            { $set: payloadWithAudit },
            { new: true }
        );

        return successHandler({
            response,
            records: result,
            message: "Bank Head updated successfully",
            status: true,
            httpCode: 200,
        });
    } catch (error) {
        console.error("Error in updateBankHead:", error);
        return handleError(error, response);
    }
};

export { createBankHead, fetchBankDetails, fetchAgencyBankDetails, updateBankHead }
