// schemas/proposal.schema.ts
import { LocalBodyType } from "@/interfaces/enums.interface";
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
    district_id: z.string().optional(),
    block_id: z.string().optional(),
    constituency_id: z.string().optional(),
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
    district_id: z.string(),
    sector_id: z.string(),
    // permissible_works_id: z.array(zObjectId).optional(),

    old_work: z.boolean(),
    reference_number: z.string().optional(),
    manual_reference_number: z.string().optional(),

    recommender_name: z.string().min(1),
    recommender_contact: z.number(),
    recommender_email: z.email(),
    recommender_type: z.enum(["MLA", "OTHER"]),
    recommender_designation: z.string().optional(),
    sub_sector: z.string().optional(),

    area_type: z.enum(["RU", "UR"]),
    proposal_name: z.string().min(1),
    sector_name: z.string().min(1),

    permissible_work: z.array(z.string()).optional(),

    proposal_amount: z.number().nonnegative(),

    approved_by_dlc: z.boolean(),
    approved_by_nm: z.boolean(),

    assigned_ia: z.string(),
    assigned_ia_name: z.string(),

    approved_by: z.enum(["DLC", "NODAL_MINISTER", "BOTH"]).optional(),

    location: LocationSchema,
});

export type ProposalFormValues = z.infer<typeof ProposalFormSchema> & {
    _id?: string
};

// export type ProposalFormValues = z.infer<typeof ProposalFormSchema>;