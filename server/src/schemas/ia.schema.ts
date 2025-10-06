//* package imports
import { z } from "zod";

//* file imports
import { zObjectId } from "@/utils/utility-functions";

const CreateImplementationAgencySchema = z.object({
    district_id: zObjectId,
    block_id: zObjectId.nullable().optional(),

    district_code: z.string().min(1, { message: "District code is required" }),
    block_code: z.string().nullable().optional(),

    district_name: z
        .string()
        .min(2, { message: "District name must be at least 2 characters long" })
        .max(100, { message: "District name must not exceed 100 characters" }),

    block_name: z
        .string().nullable().optional(),

    agency_name: z
        .string()
        .min(2, { message: "Agency name must be at least 2 characters long" })
        .max(150, { message: "Agency name must not exceed 150 characters" })
});

const UpdateImplementationAgencySchema = z.object({
    district_id: zObjectId.optional(),
    block_id: zObjectId.nullable().optional(),

    district_code: z.string().optional(),
    block_code: z.string().nullable().optional(),

    district_name: z.string().min(2).max(100).optional(),
    block_name: z.string().nullable().optional(),

    agency_name: z.string().min(2).max(150).optional(),
});

const PartialImplementationAgencySchema =
    CreateImplementationAgencySchema.partial();

type CreateImplementationAgencyDto = z.infer<
    typeof CreateImplementationAgencySchema
>;
type UpdateImplementationAgencyDto = z.infer<
    typeof UpdateImplementationAgencySchema
>;
type PartialImplementationAgencyDto = z.infer<
    typeof PartialImplementationAgencySchema
>;

export {
    CreateImplementationAgencyDto,
    CreateImplementationAgencySchema,

    UpdateImplementationAgencyDto,
    UpdateImplementationAgencySchema,

    PartialImplementationAgencyDto,
    PartialImplementationAgencySchema
}
