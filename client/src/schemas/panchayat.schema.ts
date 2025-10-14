//* package imports
import { z } from "zod"

//* base schema
const PanchayatBaseSchema = z.object({
    district_id: z.string().min(1, "District ID is required"),
    block_id: z.string().min(1, "Block ID is required"),

    district_code: z.string().min(2, "District code is required!"),
    block_code: z.string().min(2, "Block code is required!"),

    district_name: z.string().min(3, "District name is required!"),
    block_name: z.string().min(3, "Block name is required!"),

    panchayat_name: z.string().min(3, "Panchayat name is required!")
})

//? CRUD SCHEMA
const CreatePanchayatSchema = PanchayatBaseSchema.extend({})

//? DTO's 
type PanchayatFormValues = z.infer<typeof CreatePanchayatSchema>

export {
    type PanchayatFormValues,
    CreatePanchayatSchema
}
