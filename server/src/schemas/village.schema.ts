//* package imports
import { z } from "zod"

//* file imports
import { zObjectId } from "@/utils/utility-functions"

//* base schema
const VillageBaseSchema = z.object({
    district_id: zObjectId,
    block_id: zObjectId,
    panchayat_id: zObjectId,

    district_code: z.string().min(2, "District code is required!"),
    block_code: z.string().min(2, "Block code is required!"),
    panchayat_code: z.string().min(2, "Panchayat code is required!"),

    district_name: z.string().min(3, "District name is required!"),
    block_name: z.string().min(3, "Block name is required!"),
    panchayat_name: z.string().min(3, "Panchayat name is required!"),

    village_name: z.string().min(3, "Village name is required!"),
    hadbast_number: z.string().min(1, "Hadbast number is required!"),
})

//? CRUD SCHEMA
const CreateVillageSchema = VillageBaseSchema.extend({})
const UpdateVillageSchema = z.object({
    village_name: z.string().min(3, "Village name is required"),
    hadbast_number: z.string().min(1, "Hadbast number is required!"),
})

//? DTO's 
type CreateVillageDto = z.infer<typeof CreateVillageSchema>
type UpdateVillageDto = z.infer<typeof UpdateVillageSchema>

export {
    CreateVillageDto,
    CreateVillageSchema,

    UpdateVillageDto,
    UpdateVillageSchema
}
