//* package imports

import { Double, Types } from "mongoose"
import { ProjectStatus } from "@/interfaces/enums.interface"

export interface IProjectProgress {
    proposal_id: Types.ObjectId
    project_id: Types.ObjectId
    agency_id: Types.ObjectId
    nodal_minister: Types.ObjectId

    actual_start_date: Date
    actual_end_date: Date
    tentative_start_date: Date
    tentative_end_date: Date

    approved_by_dlc: boolean

    sent_to_nm: boolean
    document_by_nm: string[]
    approved_by_nm: boolean

    project_status: ProjectStatus,
    progress: Double

    sent_to_ia: boolean
    sent_to_agency: boolean
    concerned_agency: string
    document_by_agency: string[]
    technical_eastimation_document: string[]
    financial_estimation_document: string[]
    financial_approval: boolean
    technical_approval: boolean
    approved_by_ia: boolean
    document_by_dlc: string[]

    estimated_funds: Double
    approved_funds: boolean
    sanctioned_funds: Double
    transferred_funds: Double
    bank_account_number: Double
    remaining_funds: Double

    assigned_ia: Types.ObjectId
    assigned_ia_name: String

    isDeleted: boolean
    createdBy: Types.ObjectId
    updatedBy?: Types.ObjectId

    lastActionTakenBy: Types.ObjectId
}
