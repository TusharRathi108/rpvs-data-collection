// schemas/proposal.schema.ts
import { z } from "zod";

export const WardSchema = z.object({
    ward_code: z.string().min(1),
    ward_number: z.string().min(1),
    ward_name: z.string().min(1),
    local_body_type_code: z.string().min(1),
    local_body_type_name: z.string().min(1),
});

export const VillageSchema = z.object({
    panchayat_code: z.string().min(1),
    village_code: z.string().min(1),
    village_name: z.string().min(1),
    panchayat_name: z.string().min(1),
});

export const LocationSchema = z.object({
    state_id: z.string().optional(),
    district_id: z.string().optional(),
    block_id: z.string().optional(),
    constituency_id: z.string().optional(),
    local_body_type_id: z.string().optional(),
    local_body_id: z.string().optional(),
    panchayat_id: z.string().optional(),
    ward_id: z.array(z.string()).optional(),
    village_id: z.array(z.string()).optional(),

    area_type: z.enum(["RU", "UR"]),

    state_code: z.string().optional(),
    state_name: z.string().optional(),
    district_code: z.string().min(1),
    district_name: z.string().optional(),
    block_code: z.string().optional(),
    block_name: z.string().optional(),
    constituency_code: z.string().optional(),
    constituency_name: z.string().optional(),

    local_body_type_code: z.string().optional(),
    local_body_type_name: z.string().optional(),
    local_body_code: z.string().optional(),
    local_body_name: z.string().optional(),

    panchayat_code: z.string().optional(),
    panchayat_name: z.string().optional(),

    villages: z.array(VillageSchema),
    wards: z.array(WardSchema)
});

export const ProposalFormSchema = z.object({
    sector_id: z.string(),
    department_id: z.string(),
    // permissible_works_id: z.array(zObjectId).optional(),

    old_work: z.boolean(),
    reference_number: z.string().optional(),
    manual_reference_number: z.union([z.string().min(1), z.literal("")]).optional(),

    recommender_name: z.string().min(1),
    recommender_contact: z.number().min(1, "Contact is required!"),
    recommender_email: z
        .union([z.email({ message: "Invalid email" }), z.literal("")])
        .optional(),
    recommender_type: z.enum(["MLA", "OTHER"]),
    recommender_designation: z.string().optional(),

    area_type: z.enum(["RU", "UR"]),
    proposal_name: z.string().min(1, "Prposal name is required!"),
    department_name: z.string().min(1, "Deparment is required!"),
    sector_name: z.string().min(1, "Sector is required!"),
    sub_sector: z.string().optional(),

    // sub_sector_name: z.string().optional(),

    permissible_work: z.array(z.string().min(1, "permissible work is required!")).optional(),

    proposal_amount: z.number().nonnegative().min(1, "Proposal amount is reuiqred!"),

    sanctioned_funds: z.union([z.number().nonnegative(), z.null()]).optional(),
    transferred_funds: z.union([z.number().nonnegative(), z.null()]).optional(),

    ifsc_code: z.union([z.string().min(1), z.literal("")]).optional(),

    branch_code: z.union([z.string().min(1), z.literal("")]).optional(),
    branch_name: z.union([z.string().min(1), z.literal("")]).optional(),
    bank_name: z.union([z.string().min(1), z.literal("")]).optional(),
    bank_account_number: z.union([z.string(), z.literal("")]).optional(),

    approved_by_dlc: z.boolean(),
    approved_by_nm: z.boolean(),

    assigned_ia: z.string(),
    assigned_ia_name: z.string().min(1, "IA is required!"),

    approved_by: z.enum(["DLC", "NODAL_MINISTER", "BOTH"]).optional(),

    location: LocationSchema,
});

export type ProposalFormValues = z.infer<typeof ProposalFormSchema> & {
    _id?: string
};
