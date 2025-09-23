//* package imports
import { z } from "zod";

//* file imports
import { zObjectId } from "@/utils/utility-functions";
import { LocationSchema } from "@/schemas/location.schema";
import { ProposalRecommenderType, ProposalActionType, AreaType } from "@/interfaces/enums.interface";

const ProposalBaseSchema = z.object({
    nodal_minister_id: zObjectId.optional(),
    sector_id: zObjectId,
    permissible_works_id: z.array(zObjectId).optional(),
    department_id: zObjectId,
    department_name: z.string(),

    // old_work: z.boolean().optional(),
    nodal_minister: z.string().trim().optional(),
    // reference_number: z.string().trim(),
    manual_reference_number: z.string().trim().optional(),

    recommender_name: z.string().trim().min(1),
    recommender_contact: z.number().nonnegative(),
    recommender_email: z
        .union([z.email({ message: "Invalid email" }), z.literal("")])
        .optional(),
    recommender_type: z.enum(ProposalRecommenderType),
    recommender_designation: z.string().trim().optional(),

    area_type: z.enum(AreaType),
    proposal_name: z.string().trim().min(1),
    sector_name: z.string().trim().min(1),
    // sub_sector_name: z.string().trim().min(1),

    permissible_work: z.array(z.string().trim()).optional(),

    // proposal_document: z.string().trim().min(1),
    proposal_amount: z.number().nonnegative(),

    approved_by_dlc: z.boolean().default(false),
    approved_by_nm: z.boolean().default(false),

    // financial_year: z.string().trim().min(1),

    assigned_ia: zObjectId,
    assigned_ia_name: z.string(),

    location: LocationSchema,

    actionType: z.enum(ProposalActionType),
    remarks: z.string().trim().optional(),

    isDeleted: z.boolean().default(false),
});

const CreateProposalSchema = ProposalBaseSchema.extend({
});

const UpdateProposalSchema = ProposalBaseSchema.extend({
});

const PartialUpdateProposalSchema = ProposalBaseSchema.partial().extend({
});

type CreateProposalDto = z.infer<typeof CreateProposalSchema>;
type UpdateProposalDto = z.infer<typeof UpdateProposalSchema>;
type PartialUpdateProposalDto = z.infer<typeof PartialUpdateProposalSchema>;

export {
    CreateProposalDto,
    CreateProposalSchema,
    UpdateProposalDto,
    UpdateProposalSchema,
    PartialUpdateProposalDto,
    PartialUpdateProposalSchema
}