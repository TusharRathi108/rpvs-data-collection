//* package imports
import z from "zod";

//* file imoports
import { zObjectId } from "@/utils/utility-functions";

const subSectorSchema = z.object({
    sub_sector: z.string().min(1, "Sub-sector is required"),
    works: z.array(z.string().min(1)).min(1, "At least one work is required"),
});

const sectorSchema = z.object({
    department_id: zObjectId,
    sector_name: z.string().min(1, "Sector name is required"),
    permissible_works: z.array(z.union([z.string().min(1), subSectorSchema])),
    createBy: zObjectId,
    updatedBy: zObjectId.optional(),
});

type sectorDto = z.infer<typeof sectorSchema>
type subSectorDto = z.infer<typeof subSectorSchema>

export {
    sectorDto,
    sectorSchema,

    subSectorDto,
    subSectorSchema
};
