//* package imports
import mongoose, { PipelineStage } from "mongoose";
import { NextFunction, Request, Response } from "express";

//* file imports
import { env } from "@/configs/env";
import { SessionUser } from "@/types/session-user";
import { calculateFinancialYear, toObjectId } from "@/utils/utility-functions";
import { ProposalMasterModel } from "@/models/proposal.model";
import { ExceptionType, throwHttpException } from "@/utils/http-exception";
import { handleError, successHandler } from "@/globals/response-handler.helper";
import {
    CreateProposalSchema,
    CreateProposalDto,
    PartialUpdateProposalSchema,
} from "@/schemas/proposal.schema";
import { generateProposalRef } from "@/utils/generate-reference_number";
import { ProjectMasterModel } from "@/models/project.model";
import { ProjectProgressModel } from "@/models/project-progress.model";

// const createProposal = async (request: Request, response: Response) => {
//     try {
//         const user = request.user as SessionUser;

//         if (!user) {
//             throwHttpException(ExceptionType.NotFound, "User does not exist!");
//         }

//         const parsedPayload: CreateProposalDto = CreateProposalSchema.parse(request.body);

//         const financialYear = calculateFinancialYear("short");

//         const lastProposal = await ProposalMasterModel.findOne({
//             "location.state_code": user.state_code,
//             financial_year: financialYear,
//         })
//             .sort({ createdAt: -1 })
//             .select("reference_number")
//             .lean();

//         let runningNumber = 1;
//         if (lastProposal?.reference_number) {
//             const parts = lastProposal.reference_number.split("/");
//             const lastRun = parts[parts.length - 1];
//             const parsed = lastRun ? parseInt(lastRun, 10) : 1;
//             if (!isNaN(parsed)) runningNumber = parsed + 1;
//         }

//         const loc = parsedPayload.location as any;

//         const referenceNumber = generateProposalRef({
//             stateCode: user.state_code,
//             districtCode: user.district?.district_code ?? null,
//             blockCode: loc.block_code ?? null,
//             constituencyCode: loc.constituency_code,
//             panchayatCode: loc.panchayat_code ?? null,
//             localBodyType: loc.local_body_type_code ?? null,
//             localBodyCode: loc.local_body_code ?? null,
//             financialYear,
//             running_number: runningNumber.toString().padStart(4, "0"),
//         });

//         const proposalPayload = {
//             ...parsedPayload,
//             reference_number: referenceNumber,
//             financial_year: financialYear,
//             createdBy: toObjectId(user.user_id),
//             updatedBy: toObjectId(user.user_id),
//             lastActionTakenBy: toObjectId(user.user_id),
//         };

//         const createdProposal = await ProposalMasterModel.create(proposalPayload);

//         const projectPayload = {
//             proposal_id: createdProposal._id,
//             nodal_minister_id: createdProposal.nodal_minister_id,
//             sector_id: createdProposal.sector_id,
//             permissible_works_id: createdProposal.permissible_works_id,
//             department_id: createdProposal.department_id,
//             department_name: createdProposal.department_name,
//             nodal_minister: createdProposal.nodal_minister,
//             reference_number: createdProposal.reference_number,
//             manual_reference_number: createdProposal.manual_reference_number,
//             recommender_name: createdProposal.recommender_name,
//             recommender_contact: createdProposal.recommender_contact,
//             recommender_email: createdProposal.recommender_email,
//             recommender_type: createdProposal.recommender_type,
//             recommender_designation: createdProposal.recommender_designation,
//             area_type: createdProposal.area_type,
//             project_name: createdProposal.proposal_name,
//             sector_name: createdProposal.sector_name,
//             sub_sector_name: createdProposal.sub_sector_name,
//             permissible_work: createdProposal.permissible_work,
//             proposal_document: createdProposal.proposal_document
//                 ? [createdProposal.proposal_document]
//                 : [],
//             proposal_amount: createdProposal.proposal_amount,
//             approved_by_dlc: createdProposal.approved_by_dlc,
//             approved_by_nm: createdProposal.approved_by_nm,
//             financial_year: createdProposal.financial_year,
//             location: createdProposal.location,
//             actionType: createdProposal.actionType,
//             remarks: createdProposal.remarks,
//             isDeleted: false,
//             createdBy: toObjectId(user.user_id),
//             updatedBy: toObjectId(user.user_id),
//             lastActionTakenBy: toObjectId(user.user_id),
//         };

//         const createdProject = await ProjectMasterModel.create(projectPayload);

//         const progressPayload = {
//             proposal_id: createdProposal._id,
//             project_id: createdProject._id,
//             agency_id: null,
//             nodal_minister: createdProposal.nodal_minister_id,

//             // funds setup
//             estimated_funds: createdProposal.proposal_amount,
//             approved_funds: true,
//             sanctioned_funds: parsedPayload.proposal_amount,
//             transferred_funds: parsedPayload.transferred_funds,
//             remaining_funds: parsedPayload.proposal_amount! - (parsedPayload.transferred_funds || 0),

//             ifsc_code: parsedPayload.ifsc_code,
//             branch_name: parsedPayload.branch_name,
//             branch_code: parsedPayload.branch_code,
//             bank_name: parsedPayload.bank_name,
//             bank_account_number: parsedPayload.bank_account_number,


//             // IA assignment from frontend payload
//             assigned_ia: parsedPayload.assigned_ia ?? null,
//             assigned_ia_name: parsedPayload.assigned_ia_name ?? null,

//             // approvals copied
//             approved_by_dlc: createdProposal.approved_by_dlc,
//             approved_by_nm: createdProposal.approved_by_nm,

//             project_status: "RECEIVED",
//             progress: 0,

//             sent_to_nm: false,
//             document_by_nm: [],
//             sent_to_ia: false,
//             sent_to_agency: false,
//             concerned_agency: "",
//             document_by_agency: [],
//             technical_eastimation_document: [],
//             financial_estimation_document: [],
//             financial_approval: false,
//             technical_approval: false,
//             approved_by_ia: false,
//             document_by_dlc: [],

//             isDeleted: false,
//             createdBy: toObjectId(user.user_id),
//             updatedBy: toObjectId(user.user_id),
//             lastActionTakenBy: toObjectId(user.user_id),
//         };

//         const createdProgress = await ProjectProgressModel.create(progressPayload);

//         return successHandler({
//             response,
//             records: {
//                 proposal: createdProposal,
//                 project: createdProject,
//                 progress: createdProgress,
//             },
//             message: env.DEF_SUCCESS_MESSAGE,
//             status: true,
//             httpCode: 200,
//         });
//     } catch (error) {
//         console.error("Error in createProposal:", error);
//         return handleError(error, response);
//     }
// };

// const createProposal = async (request: Request, response: Response) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         const user = request.user as SessionUser;
//         if (!user) {
//             throwHttpException(ExceptionType.NotFound, "User does not exist!");
//         }

//         const parsedPayload: CreateProposalDto = CreateProposalSchema.parse(request.body);
//         const financialYear = calculateFinancialYear("short");

//         const lastProposal = await ProposalMasterModel.findOne(
//             {
//                 "location.state_code": user.state_code,
//                 financial_year: financialYear,
//             },
//             { reference_number: 1 },
//             { session }
//         )
//             .sort({ createdAt: -1 })
//             .lean<{ reference_number?: string }>();

//         let runningNumber = 1;
//         const lastRef: string | undefined = lastProposal?.reference_number;
//         if (lastRef) {
//             const parts = lastRef.split("/");
//             const lastRun = parts[parts.length - 1];
//             const parsed = lastRun ? parseInt(lastRun, 10) : 1;
//             if (!isNaN(parsed)) runningNumber = parsed + 1;
//         }

//         const loc = parsedPayload.location as any;

//         const referenceNumber = generateProposalRef({
//             stateCode: user.state_code,
//             districtCode: user.district?.district_code ?? null,
//             blockCode: loc.block_code ?? null,
//             constituencyCode: loc.constituency_code,
//             panchayatCode: loc.panchayat_code ?? null,
//             localBodyType: loc.local_body_type_code ?? null,
//             localBodyCode: loc.local_body_code ?? null,
//             financialYear,
//             running_number: runningNumber.toString().padStart(4, "0"),
//         });

//         // --- Proposal ---
//         const proposalPayload = {
//             ...parsedPayload,
//             reference_number: referenceNumber,
//             financial_year: financialYear,
//             createdBy: toObjectId(user.user_id),
//             updatedBy: toObjectId(user.user_id),
//             lastActionTakenBy: toObjectId(user.user_id),
//         };

//         const createdProposal = await ProposalMasterModel.create([proposalPayload], { session });
//         const proposal = createdProposal[0];

//         if (!proposal) {
//             return throwHttpException(ExceptionType.NotFound, "Proposal not created!")
//         }

//         // --- Project ---
//         const projectPayload = {
//             proposal_id: proposal._id,
//             nodal_minister_id: proposal.nodal_minister_id,
//             sector_id: proposal.sector_id,
//             permissible_works_id: proposal.permissible_works_id,
//             department_id: proposal.department_id,
//             department_name: proposal.department_name,
//             nodal_minister: proposal.nodal_minister,
//             reference_number: proposal.reference_number,
//             manual_reference_number: proposal.manual_reference_number,
//             recommender_name: proposal.recommender_name,
//             recommender_contact: proposal.recommender_contact,
//             recommender_email: proposal.recommender_email,
//             recommender_type: proposal.recommender_type,
//             recommender_designation: proposal.recommender_designation,
//             area_type: proposal.area_type,
//             project_name: proposal.proposal_name,
//             sector_name: proposal.sector_name,
//             sub_sector_name: proposal.sub_sector_name,
//             permissible_work: proposal.permissible_work,
//             proposal_document: proposal.proposal_document ? [proposal.proposal_document] : [],
//             proposal_amount: proposal.proposal_amount,
//             approved_by_dlc: proposal.approved_by_dlc,
//             approved_by_nm: proposal.approved_by_nm,
//             financial_year: proposal.financial_year,
//             location: proposal.location,
//             actionType: proposal.actionType,
//             remarks: proposal.remarks,
//             isDeleted: false,
//             createdBy: toObjectId(user.user_id),
//             updatedBy: toObjectId(user.user_id),
//             lastActionTakenBy: toObjectId(user.user_id),
//         };

//         const createdProject = await ProjectMasterModel.create([projectPayload], { session });
//         const project = createdProject[0];

//         if (!project) {
//             return throwHttpException(ExceptionType.NotFound, "Proposal not created!")
//         }

//         // --- Progress ---
//         const progressPayload = {
//             proposal_id: proposal._id,
//             project_id: project._id,
//             agency_id: null,
//             nodal_minister: proposal.nodal_minister_id,

//             estimated_funds: proposal.proposal_amount,
//             approved_funds: true,
//             sanctioned_funds: parsedPayload.proposal_amount,
//             transferred_funds: parsedPayload.transferred_funds,
//             remaining_funds: parsedPayload.proposal_amount! - (parsedPayload.transferred_funds || 0),

//             ifsc_code: parsedPayload.ifsc_code,
//             branch_name: parsedPayload.branch_name,
//             branch_code: parsedPayload.branch_code,
//             bank_name: parsedPayload.bank_name,
//             bank_account_number: parsedPayload.bank_account_number,

//             assigned_ia: parsedPayload.assigned_ia ?? null,
//             assigned_ia_name: parsedPayload.assigned_ia_name ?? null,

//             approved_by_dlc: proposal.approved_by_dlc,
//             approved_by_nm: proposal.approved_by_nm,

//             project_status: "RECEIVED",
//             progress: 0,

//             sent_to_nm: false,
//             document_by_nm: [],
//             sent_to_ia: false,
//             sent_to_agency: false,
//             concerned_agency: "",
//             document_by_agency: [],
//             technical_eastimation_document: [],
//             financial_estimation_document: [],
//             financial_approval: false,
//             technical_approval: false,
//             approved_by_ia: false,
//             document_by_dlc: [],

//             isDeleted: false,
//             createdBy: toObjectId(user.user_id),
//             updatedBy: toObjectId(user.user_id),
//             lastActionTakenBy: toObjectId(user.user_id),
//         };

//         const createdProgress = await ProjectProgressModel.create([progressPayload], { session });
//         const progress = createdProgress[0];

//         await session.commitTransaction();

//         return successHandler({
//             response,
//             records: { proposal, project, progress },
//             message: env.DEF_SUCCESS_MESSAGE,
//             status: true,
//             httpCode: 200,
//         });
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         console.error("Error in createProposal:", error);
//         return handleError(error, response);
//     } finally {
//         session.endSession();
//     }
// };

const createProposal = async (
    request: Request,
    response: Response,
    _next: NextFunction,
    session: mongoose.ClientSession
) => {
    const user = request.user as SessionUser;
    if (!user) {
        throwHttpException(ExceptionType.NotFound, "User does not exist!");
    }
    // validate body
    const parsedPayload: CreateProposalDto = CreateProposalSchema.parse(request.body);
    const financialYear = calculateFinancialYear("short");

    // get last reference number
    const lastProposal = await ProposalMasterModel.findOne(
        { "location.state_code": user.state_code, financial_year: financialYear },
        { reference_number: 1 },
        { session }
    )
        .sort({ createdAt: -1 })
        .lean<{ reference_number?: string }>();

    let runningNumber = 1;
    if (lastProposal?.reference_number) {
        const parts = lastProposal.reference_number.split("/");
        const lastRun = parts[parts.length - 1];
        const parsed = lastRun ? parseInt(lastRun, 10) : 1;
        if (!isNaN(parsed)) runningNumber = parsed + 1;
    }

    const loc = parsedPayload.location as any;
    const referenceNumber = generateProposalRef({
        stateCode: user.state_code,
        districtCode: user.district?.district_code ?? null,
        blockCode: loc.block_code ?? null,
        constituencyCode: loc.constituency_code,
        panchayatCode: loc.panchayat_code ?? null,
        localBodyType: loc.local_body_type_code ?? null,
        localBodyCode: loc.local_body_code ?? null,
        financialYear,
        running_number: runningNumber.toString().padStart(4, "0"),
    });

    const proposalPayload = {
        ...parsedPayload,
        reference_number: referenceNumber,
        financial_year: financialYear,
        createdBy: toObjectId(user.user_id),
        updatedBy: toObjectId(user.user_id),
        lastActionTakenBy: toObjectId(user.user_id),
    };

    const createdProposalArr = await ProposalMasterModel.create([proposalPayload], { session });
    const createdProposal = createdProposalArr[0];
    if (!createdProposal) {
        throwHttpException(ExceptionType.Conflict, "Proposal not created!");
    }

    const projectPayload = {
        proposal_id: createdProposal._id,
        nodal_minister_id: createdProposal.nodal_minister_id,
        sector_id: createdProposal.sector_id,
        permissible_works_id: createdProposal.permissible_works_id,
        department_id: createdProposal.department_id,
        department_name: createdProposal.department_name,
        nodal_minister: createdProposal.nodal_minister,
        reference_number: createdProposal.reference_number,
        manual_reference_number: createdProposal.manual_reference_number,
        recommender_name: createdProposal.recommender_name,
        recommender_contact: createdProposal.recommender_contact,
        recommender_email: createdProposal.recommender_email,
        recommender_type: createdProposal.recommender_type,
        recommender_designation: createdProposal.recommender_designation,
        area_type: createdProposal.area_type,
        project_name: createdProposal.proposal_name,
        sector_name: createdProposal.sector_name,
        sub_sector_name: createdProposal.sub_sector_name,
        permissible_work: createdProposal.permissible_work,
        proposal_document: createdProposal.proposal_document
            ? [createdProposal.proposal_document]
            : [],
        proposal_amount: createdProposal.proposal_amount,
        approved_by_dlc: createdProposal.approved_by_dlc,
        approved_by_nm: createdProposal.approved_by_nm,
        financial_year: createdProposal.financial_year,
        location: createdProposal.location,
        actionType: createdProposal.actionType,
        remarks: createdProposal.remarks,
        isDeleted: false,
        createdBy: toObjectId(user.user_id),
        updatedBy: toObjectId(user.user_id),
        lastActionTakenBy: toObjectId(user.user_id),
    };

    const createdProjectArr = await ProjectMasterModel.create([projectPayload], { session });
    const createdProject = createdProjectArr[0];
    if (!createdProject) {
        throwHttpException(ExceptionType.Conflict, "Project not created!");
    }

    const progressPayload = {
        proposal_id: createdProposal._id,
        project_id: createdProject._id,
        agency_id: null,
        nodal_minister: createdProposal.nodal_minister_id,

        estimated_funds: createdProposal.proposal_amount,
        approved_funds: true,
        sanctioned_funds: parsedPayload.proposal_amount,
        transferred_funds: parsedPayload.transferred_funds,
        remaining_funds:
            parsedPayload.proposal_amount! - (parsedPayload.transferred_funds || 0),

        ifsc_code: parsedPayload.ifsc_code,
        branch_name: parsedPayload.branch_name,
        branch_code: parsedPayload.branch_code,
        bank_name: parsedPayload.bank_name,
        bank_account_number: parsedPayload.bank_account_number,

        assigned_ia: parsedPayload.assigned_ia ?? null,
        assigned_ia_name: parsedPayload.assigned_ia_name ?? null,

        approved_by_dlc: createdProposal.approved_by_dlc,
        approved_by_nm: createdProposal.approved_by_nm,

        project_status: "RECEIVED",
        progress: 0,

        sent_to_nm: false,
        document_by_nm: [],
        sent_to_ia: false,
        sent_to_agency: false,
        concerned_agency: "",
        document_by_agency: [],
        technical_eastimation_document: [],
        financial_estimation_document: [],
        financial_approval: false,
        technical_approval: false,
        approved_by_ia: false,
        document_by_dlc: [],

        isDeleted: false,
        createdBy: toObjectId(user.user_id),
        updatedBy: toObjectId(user.user_id),
        lastActionTakenBy: toObjectId(user.user_id),
    };

    const createdProgressArr = await ProjectProgressModel.create([progressPayload], { session });
    const createdProgress = createdProgressArr[0];

    return successHandler({
        response,
        records: {
            proposal: createdProposal,
            project: createdProject,
            progress: createdProgress,
        },
        message: process.env.DEF_SUCCESS_MESSAGE ?? "Success",
        status: true,
        httpCode: 200,
    });
};

const fetchProposalDetails = async (request: Request, response: Response) => {
    try {
        const user = request.user as SessionUser

        const pipeline: PipelineStage[] = [
            {
                $match: {
                    "location.district_code": user.district_code
                }
            },
            {
                $lookup: {
                    from: "project_progresses",
                    let: { proposalId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$proposal_id", "$$proposalId"] },
                            },
                        },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                    ],
                    as: "progress",
                },
            },
            { $unwind: { path: "$progress", preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    assigned_ia: "$progress.assigned_ia",
                    assigned_ia_name: "$progress.assigned_ia_name",
                    transferred_funds: "$progress.transferred_funds",
                    sanctioned_funds: "$progress.sanctioned_funds",

                    ifsc_code: "$progress.ifsc_code",
                    branch_name: "$progress.branch_name",
                    branch_code: "$progress.branch_code",
                    bank_name: "$progress.bank_name",
                    bank_account_number: "$progress.bank_account_number"
                },
            },
            {
                $project: {
                    progress: 0,
                },
            },
        ];

        const result = await ProposalMasterModel.aggregate(pipeline)

        return successHandler({
            response,
            records: result,
            message: env.DEF_SUCCESS_MESSAGE,
            status: true,
            httpCode: 200,
        });
    } catch (error) {
        console.error("Error in fetchProposalDetails:", error);
        return handleError(error, response);
    }
};

const fetchSingleProposal = async (request: Request, response: Response) => {
    try {
        const { proposal_id } = request.params;

        if (!proposal_id) {
            throwHttpException(ExceptionType.BadRequest, "Proposal ID is required");
        }

        const objectId = toObjectId(proposal_id);

        const pipeline: PipelineStage[] = [
            { $match: { _id: objectId, isDeleted: false } },
            {
                $project: {
                    _id: 1,
                    proposal_name: 1,
                    proposal_amount: 1,
                    financial_year: 1,
                    sector_name: 1,
                    recommender_name: 1,
                    recommender_email: 1,
                    recommender_type: 1,
                    approved_by_dlc: 1,
                    approved_by_nm: 1,
                    createdBy: 1,
                    updatedBy: 1,
                    lastActionTakenBy: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ];

        const result = await ProposalMasterModel.aggregate(pipeline);

        return successHandler({
            response,
            records: result[0] || null,
            message: "Proposal fetched successfully",
            status: true,
            httpCode: 200,
        });
    } catch (error) {
        console.error("Error in fetchSingleProposal:", error);
        return handleError(error, response);
    }
};

// const updateProposal = async (request: Request, response: Response) => {
//     try {
//         const user = request.user as SessionUser;
//         const { proposal_id } = request.params;

//         if (!proposal_id) {
//             throwHttpException(ExceptionType.BadRequest, "Proposal ID is required");
//         }

//         const parseResult = PartialUpdateProposalSchema.safeParse(request.body.data);

//         if (!parseResult.success) {
//             return response.status(400).json({
//                 status: false,
//                 message: "Validation failed",
//                 errors: parseResult.error.format(),
//             });
//         }

//         const validatedData = parseResult.data;

//         await ProposalMasterModel.updateOne(
//             { _id: toObjectId(proposal_id), isDeleted: false },
//             {
//                 $set: {
//                     ...validatedData,
//                     updatedBy: toObjectId(user.user_id),
//                     lastActionTakenBy: toObjectId(user.user_id),
//                 },
//             }
//         );

//         const updatedProposal = await ProposalMasterModel.findById(proposal_id).lean();

//         if (!updatedProposal) {
//             throwHttpException(ExceptionType.NotFound, "Proposal not found after update");
//         }

//         const projectPayload = {
//             nodal_minister_id: updatedProposal.nodal_minister_id,
//             sector_id: updatedProposal.sector_id,
//             permissible_works_id: updatedProposal.permissible_works_id,
//             department_id: updatedProposal.department_id,
//             department_name: updatedProposal.department_name,
//             nodal_minister: updatedProposal.nodal_minister,
//             reference_number: updatedProposal.reference_number,
//             manual_reference_number: updatedProposal.manual_reference_number,

//             recommender_name: updatedProposal.recommender_name,
//             recommender_contact: updatedProposal.recommender_contact,
//             recommender_email: updatedProposal.recommender_email,
//             recommender_type: updatedProposal.recommender_type,
//             recommender_designation: updatedProposal.recommender_designation,

//             area_type: updatedProposal.area_type,
//             project_name: updatedProposal.proposal_name,
//             sector_name: updatedProposal.sector_name,
//             sub_sector_name: updatedProposal.sub_sector_name,
//             permissible_work: updatedProposal.permissible_work,

//             proposal_document: updatedProposal.proposal_document
//                 ? [updatedProposal.proposal_document]
//                 : [],

//             proposal_amount: updatedProposal.proposal_amount,

//             approved_by_dlc: updatedProposal.approved_by_dlc,
//             approved_by_nm: updatedProposal.approved_by_nm,
//             financial_year: updatedProposal.financial_year,
//             location: updatedProposal.location,
//             actionType: updatedProposal.actionType,
//             remarks: updatedProposal.remarks,
//             updatedBy: toObjectId(user.user_id),
//             lastActionTakenBy: toObjectId(user.user_id),
//         };

//         await ProjectMasterModel.updateOne(
//             { proposal_id: toObjectId(proposal_id), isDeleted: false },
//             { $set: projectPayload }
//         );

//         await ProjectProgressModel.updateOne(
//             { proposal_id: toObjectId(proposal_id), isDeleted: false },
//             {
//                 $set: {
//                     estimated_funds: updatedProposal.proposal_amount,
//                     sanctioned_funds: parseResult.data.proposal_amount,
//                     transferred_funds: parseResult.data.transferred_funds,
//                     remaining_funds: (parseResult.data.proposal_amount! - (parseResult.data.sanctioned_funds ?? 0)),

//                     ifsc_code: parseResult.data.ifsc_code,
//                     branch_code: parseResult.data.branch_code,
//                     branch_name: parseResult.data.branch_name,
//                     bank_name: parseResult.data.bank_name,
//                     bank_account_number: parseResult.data.bank_account_number,

//                     approved_by_dlc: updatedProposal.approved_by_dlc,
//                     approved_by_nm: updatedProposal.approved_by_nm,
//                     updatedBy: toObjectId(user.user_id),
//                     lastActionTakenBy: toObjectId(user.user_id),
//                 },
//             }
//         );

//         return successHandler({
//             response,
//             records: { proposal: updatedProposal },
//             message: "Proposal and related project updated successfully",
//             status: true,
//             httpCode: 200,
//         });
//     } catch (error) {
//         console.error("Error in updateProposal:", error);
//         return handleError(error, response);
//     }
// };

// const updateProposal = async (request: Request, response: Response) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         const user = request.user as SessionUser;
//         const { proposal_id } = request.params;

//         if (!proposal_id) {
//             throwHttpException(ExceptionType.BadRequest, "Proposal ID is required");
//         }

//         const parseResult = PartialUpdateProposalSchema.safeParse(request.body.data);

//         if (!parseResult.success) {
//             await session.abortTransaction();
//             session.endSession();
//             return response.status(400).json({
//                 status: false,
//                 message: "Validation failed",
//                 errors: parseResult.error.format(),
//             });
//         }

//         const validatedData = parseResult.data;

//         // --- Proposal update ---
//         await ProposalMasterModel.updateOne(
//             { _id: toObjectId(proposal_id), isDeleted: false },
//             {
//                 $set: {
//                     ...validatedData,
//                     updatedBy: toObjectId(user.user_id),
//                     lastActionTakenBy: toObjectId(user.user_id),
//                 },
//             },
//             { session }
//         );

//         const updatedProposal = await ProposalMasterModel.findById(proposal_id, {}, { session }).lean();
//         if (!updatedProposal) {
//             throwHttpException(ExceptionType.NotFound, "Proposal not found after update");
//         }

//         // --- Project update ---
//         const projectPayload = {
//             nodal_minister_id: updatedProposal.nodal_minister_id,
//             sector_id: updatedProposal.sector_id,
//             permissible_works_id: updatedProposal.permissible_works_id,
//             department_id: updatedProposal.department_id,
//             department_name: updatedProposal.department_name,
//             nodal_minister: updatedProposal.nodal_minister,
//             reference_number: updatedProposal.reference_number,
//             manual_reference_number: updatedProposal.manual_reference_number,

//             recommender_name: updatedProposal.recommender_name,
//             recommender_contact: updatedProposal.recommender_contact,
//             recommender_email: updatedProposal.recommender_email,
//             recommender_type: updatedProposal.recommender_type,
//             recommender_designation: updatedProposal.recommender_designation,

//             area_type: updatedProposal.area_type,
//             project_name: updatedProposal.proposal_name,
//             sector_name: updatedProposal.sector_name,
//             sub_sector_name: updatedProposal.sub_sector_name,
//             permissible_work: updatedProposal.permissible_work,

//             proposal_document: updatedProposal.proposal_document
//                 ? [updatedProposal.proposal_document]
//                 : [],

//             proposal_amount: updatedProposal.proposal_amount,
//             approved_by_dlc: updatedProposal.approved_by_dlc,
//             approved_by_nm: updatedProposal.approved_by_nm,
//             financial_year: updatedProposal.financial_year,
//             location: updatedProposal.location,
//             actionType: updatedProposal.actionType,
//             remarks: updatedProposal.remarks,
//             updatedBy: toObjectId(user.user_id),
//             lastActionTakenBy: toObjectId(user.user_id),
//         };

//         await ProjectMasterModel.updateOne(
//             { proposal_id: toObjectId(proposal_id), isDeleted: false },
//             { $set: projectPayload },
//             { session }
//         );

//         // --- Progress update ---
//         await ProjectProgressModel.updateOne(
//             { proposal_id: toObjectId(proposal_id), isDeleted: false },
//             {
//                 $set: {
//                     estimated_funds: updatedProposal.proposal_amount,
//                     sanctioned_funds: parseResult.data.proposal_amount,
//                     transferred_funds: parseResult.data.transferred_funds,
//                     remaining_funds:
//                         (parseResult.data.proposal_amount ?? 0) -
//                         (parseResult.data.transferred_funds ?? 0),

//                     ifsc_code: parseResult.data.ifsc_code,
//                     branch_code: parseResult.data.branch_code,
//                     branch_name: parseResult.data.branch_name,
//                     bank_name: parseResult.data.bank_name,
//                     bank_account_number: parseResult.data.bank_account_number,

//                     approved_by_dlc: updatedProposal.approved_by_dlc,
//                     approved_by_nm: updatedProposal.approved_by_nm,
//                     updatedBy: toObjectId(user.user_id),
//                     lastActionTakenBy: toObjectId(user.user_id),
//                 },
//             },
//             { session }
//         );

//         await session.commitTransaction();

//         return successHandler({
//             response,
//             records: { proposal: updatedProposal },
//             message: "Proposal and related project updated successfully",
//             status: true,
//             httpCode: 200,
//         });
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         console.error("Error in updateProposal:", error);
//         return handleError(error, response);
//     } finally {
//         session.endSession();
//     }
// };

const updateProposal = async (
    request: Request,
    response: Response,
    _next: NextFunction,
    session: mongoose.ClientSession
) => {
    try {
        const user = request.user as SessionUser;
        const { proposal_id } = request.params;

        if (!proposal_id) {
            throwHttpException(ExceptionType.BadRequest, "Proposal ID is required");
        }

        const parseResult = PartialUpdateProposalSchema.safeParse(request.body.data);
        if (!parseResult.success) {
            return response.status(400).json({
                status: false,
                message: "Validation failed",
                errors: parseResult.error.format(),
            });
        }

        const validatedData = parseResult.data;

        await ProposalMasterModel.updateOne(
            { _id: toObjectId(proposal_id), isDeleted: false },
            {
                $set: {
                    ...validatedData,
                    updatedBy: toObjectId(user.user_id),
                    lastActionTakenBy: toObjectId(user.user_id),
                },
            },
            { session }
        );

        const updatedProposal = await ProposalMasterModel.findById(
            proposal_id,
            {},
            { session }
        ).lean();

        if (!updatedProposal) {
            throwHttpException(ExceptionType.NotFound, "Proposal not found after update");
        }

        const projectPayload = {
            nodal_minister_id: updatedProposal.nodal_minister_id,
            sector_id: updatedProposal.sector_id,
            permissible_works_id: updatedProposal.permissible_works_id,
            department_id: updatedProposal.department_id,
            department_name: updatedProposal.department_name,
            nodal_minister: updatedProposal.nodal_minister,
            reference_number: updatedProposal.reference_number,
            manual_reference_number: updatedProposal.manual_reference_number,
            recommender_name: updatedProposal.recommender_name,
            recommender_contact: updatedProposal.recommender_contact,
            recommender_email: updatedProposal.recommender_email,
            recommender_type: updatedProposal.recommender_type,
            recommender_designation: updatedProposal.recommender_designation,
            area_type: updatedProposal.area_type,
            project_name: updatedProposal.proposal_name,
            sector_name: updatedProposal.sector_name,
            sub_sector_name: updatedProposal.sub_sector_name,
            permissible_work: updatedProposal.permissible_work,
            proposal_document: updatedProposal.proposal_document
                ? [updatedProposal.proposal_document]
                : [],
            proposal_amount: updatedProposal.proposal_amount,
            approved_by_dlc: updatedProposal.approved_by_dlc,
            approved_by_nm: updatedProposal.approved_by_nm,
            financial_year: updatedProposal.financial_year,
            location: updatedProposal.location,
            actionType: updatedProposal.actionType,
            remarks: updatedProposal.remarks,
            updatedBy: toObjectId(user.user_id),
            lastActionTakenBy: toObjectId(user.user_id),
        };

        await ProjectMasterModel.updateOne(
            { proposal_id: toObjectId(proposal_id), isDeleted: false },
            { $set: projectPayload },
            { session }
        );

        await ProjectProgressModel.updateOne(
            { proposal_id: toObjectId(proposal_id), isDeleted: false },
            {
                $set: {
                    estimated_funds: updatedProposal.proposal_amount,
                    sanctioned_funds: validatedData.proposal_amount,
                    transferred_funds: validatedData.transferred_funds,
                    remaining_funds:
                        (validatedData.proposal_amount ?? 0) -
                        (validatedData.transferred_funds ?? 0),
                    ifsc_code: validatedData.ifsc_code,
                    branch_code: validatedData.branch_code,
                    branch_name: validatedData.branch_name,
                    bank_name: validatedData.bank_name,
                    bank_account_number: validatedData.bank_account_number,
                    approved_by_dlc: updatedProposal.approved_by_dlc,
                    approved_by_nm: updatedProposal.approved_by_nm,
                    updatedBy: toObjectId(user.user_id),
                    lastActionTakenBy: toObjectId(user.user_id),
                },
            },
            { session }
        );

        return successHandler({
            response,
            records: { proposal: updatedProposal },
            message: "Proposal and related project updated successfully",
            status: true,
            httpCode: 200,
        });
    } catch (error) {
        console.error("Error in updateProposal:", error);
        return handleError(error, response);
    }
};

export { createProposal, fetchProposalDetails, fetchSingleProposal, updateProposal };
