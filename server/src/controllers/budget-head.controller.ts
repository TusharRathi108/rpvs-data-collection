//* package imports
import { PipelineStage } from "mongoose"
import { Request, Response } from "express"

//* file imports
import { env } from "@/configs/env"
import { SessionUser } from "@/types/session-user"
import { toObjectId } from "@/utils/utility-functions"
import { BudgetHeadModel } from "@/models/budget-head.model"
import { handleError, successHandler } from "@/globals/response-handler.helper"
import { CreateBudgetHeadDto, CreateBudgetHeadSchema, UpdateBudgetHeadDto, UpdateBudgetHeadSchema } from "@/schemas/budget-head.schema"
import { ExceptionType, throwHttpException } from "@/utils/http-exception"

const createBudgetHead = async (request: Request, response: Response) => {
    try {
        const user = request.user as SessionUser;
        const parsedPayload: CreateBudgetHeadDto = CreateBudgetHeadSchema.parse(request.body);

        console.log("PARSED PAYLOAD: ", parsedPayload)

        const payloadWithAudit = {
            ...parsedPayload,
            createdBy: toObjectId(user?.user_id),
            updatedBy: toObjectId(user?.user_id),
            lastActionTakenBy: toObjectId(user?.user_id),
            sanction_number: parsedPayload.sanction_reference_number,
            allocated_budget_date: parsedPayload.sanctioned_budget_date
        };

        const result = await BudgetHeadModel.create(payloadWithAudit);

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

const fetchBudgetDetails = async (request: Request, response: Response) => {
    try {
        const user = request.user as SessionUser;

        const pipeline: PipelineStage[] = [
            {
                $match: { isDeleted: false },
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ];

        if (user.role_name === "PLANNING") {
            pipeline.push({
                $project: {
                    _id: 1,
                    district_id: 1,
                    district_code: 1,
                    district_name: 1,
                    allocated_budget: 1,
                    allocated_budget_date: 1,
                    sanctioned_budget: 1,
                    sanctioned_budget_date: 1,
                    released_budget: 1,
                    release_budget_date: 1,
                    financial_year: 1,
                    sanction_number: 1,
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
                    allocated_budget: 1,
                    allocated_budget_date: 1,
                    sanctioned_budget: 1,
                    sanctioned_budget_date: 1,
                    released_budget: 1,
                    release_budget_date: 1,
                    financial_year: 1,
                    sanction_number: 1,
                    createdBy: 1,
                    updatedBy: 1,
                    lastActionTakenBy: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            });
        }

        const result = await BudgetHeadModel.aggregate(pipeline);

        return successHandler({
            response,
            records: result,
            message: "Budget heads fetched successfully",
            status: true,
            httpCode: 200,
        });
    } catch (error) {
        console.error("Error: ", error);
        return handleError(error, response);
    }
};

const fetchSingleBudgetHeadDetails = async (request: Request, response: Response) => {
    try {
        const { budget_head_id } = request.params;

        if (!budget_head_id) {
            throwHttpException(ExceptionType.NotFound, "Budget Head ID is required");
        }

        if (!toObjectId(budget_head_id)) {
            throwHttpException(ExceptionType.NotFound, "Invalid Budget Head ID");
        }

        const pipeline: PipelineStage[] = [
            {
                $match: {
                    _id: toObjectId(budget_head_id),
                    isActive: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    district_id: 1,
                    district_code: 1,
                    district_name: 1,
                    sanction_number: 1,
                    financial_year: 1,
                    allocated_budget: 1,
                    allocated_budget_date: 1,
                    sanctioned_budget: 1,
                    sanctioned_budget_date: 1,
                    released_budget: 1,
                    release_budget_date: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ];

        const result = await BudgetHeadModel.aggregate(pipeline);

        return successHandler({
            response,
            records: result[0] || null,
            message: "Budget head fetched successfully",
            status: true,
            httpCode: 200,
        });
    } catch (error) {
        console.error("Error: ", error);
        return handleError(error, response);
    }
};

const updateBudgetHead = async (request: Request, response: Response) => {
    try {
        const user = request.user as SessionUser;
        const { budget_head_id } = request.params;

        if (!budget_head_id) {
            throwHttpException(ExceptionType.BadRequest, "Budget Head ID is required");
        }

        if (!toObjectId(budget_head_id)) {
            throwHttpException(ExceptionType.BadRequest, "Invalid Budget Head ID");
        }
        const parsedPayload: UpdateBudgetHeadDto = UpdateBudgetHeadSchema.parse(request.body);

        const existing = await BudgetHeadModel.findOne({
            _id: toObjectId(budget_head_id),
            isDeleted: false,
        });

        if (!existing) {
            throwHttpException(ExceptionType.NotFound, "Budget Head not found");
        }

        const payloadWithAudit = {
            ...parsedPayload,
            sanction_number: parsedPayload.sanction_reference_number,
            updatedBy: toObjectId(user?.user_id),
            lastActionTakenBy: toObjectId(user?.user_id),
        };

        const result = await BudgetHeadModel.findByIdAndUpdate(
            budget_head_id,
            { $set: payloadWithAudit },
            { new: true }
        );

        return successHandler({
            response,
            records: result,
            message: "Budget Head updated successfully",
            status: true,
            httpCode: 200,
        });
    } catch (error) {
        console.error("Error: ", error);
        return handleError(error, response);
    }
};

export {
    createBudgetHead,
    fetchBudgetDetails,
    fetchSingleBudgetHeadDetails,
    updateBudgetHead
}
