//* package imports
import { z } from "zod"

//* file imports
import { zObjectId } from "@/utils/utility-functions"

//* base schema
const PanchayatBaseSchema = z.object({
    district_id: zObjectId,
    block_id: zObjectId,

    district_code: z.string().min(2, "District code is required!"),
    block_code: z.string().min(2, "Block code is required!"),

    district_name: z.string().min(3, "District name is required!"),
    block_name: z.string().min(3, "Block name is required!"),

    panchayat_name: z.string().min(3, "Panchayat name is required!")
})

//? CRUD SCHEMA
const CreatePanchayatSchema = PanchayatBaseSchema.extend({})
const UpdatePanchayatSchema = z.object({
    panchayat_name: z.string().min(1, "Pancahayt name is required!")
})

//? DTO's 
type CreatePancahaytDto = z.infer<typeof CreatePanchayatSchema>
type UpdatePanchayatDto = z.infer<typeof UpdatePanchayatSchema>

export {
    CreatePancahaytDto,
    CreatePanchayatSchema,

    UpdatePanchayatDto,
    UpdatePanchayatSchema
}
