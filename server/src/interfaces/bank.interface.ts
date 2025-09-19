//* package imports
import { Types } from 'mongoose'

interface IBankHead {
    district_id: Types.ObjectId
    district_code: string
    district_name: string

    agency_code: string
    agency_name: string
    bank_name: string
    account_number: string
    ifsc_code: string
    branch_name: string
    branch_code: string

    isDeleted: boolean
    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId
    lastActionTakenBy: Types.ObjectId
}

export { IBankHead }
