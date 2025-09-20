//* package imports
import { Double, Types } from "mongoose";

interface IIfscCode {
    district_id: Types.ObjectId
    district_code: string
    district_name: string
    rbo: string
    ifsc_code: string
    branch_code: string
    branch_name: string
    branch_manager_name: string
    contact_number: Double
    remarks: string
    isDeleted: boolean
    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId
    lastActionTakenBy: Types.ObjectId
}

export { IIfscCode }
