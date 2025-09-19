//* package imports
import { Types } from "mongoose"

export interface ISectorMaster {
    department_id: Types.ObjectId
    sector_name: string
    permissible_works:
    | string[]
    | {
        sub_sector: string
        works: string[]
    }[]
    isDeleted: boolean
    createBy: Types.ObjectId
    updatedBy: Types.ObjectId
}