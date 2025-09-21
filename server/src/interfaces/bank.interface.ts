//* package imports
import { Double, Types } from 'mongoose'

interface IBank {
    district_id: Types.ObjectId
    agency_id: Types.ObjectId
    district_code: string
    district_name: string

    rbo: string
    ifsc_code: string
    bank_name: string
    branch_code: string
    branch_name: string
    branch_manager_name: string
    contact_number: Double
    remarks: string

    agency_code: string
    agency_name: string

    account_number: string

    isDeleted: boolean
    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId
    lastActionTakenBy: Types.ObjectId
}

export { IBank }
