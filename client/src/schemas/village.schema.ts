//* package imports
import { z } from "zod"

//* base schema
const VillageBaseSchema = z.object({
    district_id: z.string().min(1, "District ID is required"),
    block_id: z.string().min(1, "Block ID is required"),
    panchayat_id: z.string().min(1, "Pancahayat ID is required"),

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

//? DTO's 
type VillageFormValues = z.infer<typeof CreateVillageSchema>

export {
    type VillageFormValues,
    CreateVillageSchema,
}
