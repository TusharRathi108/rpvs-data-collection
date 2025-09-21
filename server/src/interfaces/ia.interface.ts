//* package imports
import { Types } from "mongoose";

interface IImplementationAgency {
    district_id: Types.ObjectId
    block_id: Types.ObjectId

    district_code: string
    block_code: string

    district_name: string
    block_name: string

    agency_name: string
    financial_year: string

    isDeleted: boolean
    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId
    lastActionTakenBy: Types.ObjectId
}

export {
    IImplementationAgency
}
