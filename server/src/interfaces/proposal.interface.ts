import { Types } from "mongoose"
import { ILocation } from "@/interfaces/location.interface"
import { AreaType, ProposalActionType, ProposalRecommenderType, ProposalStatus } from "@/interfaces/enums.interface"

export interface IProposalMaster {
    nodal_minister_id: Types.ObjectId
    sector_id: Types.ObjectId
    permissible_works_id: Types.ObjectId[]
    department_id: Types.ObjectId
    department_name: string
    old_work: boolean
    nodal_minister: string
    reference_number: string
    manual_reference_number: string
    recommender_name: string
    recommender_contact: number
    recommender_email: string
    recommender_type: ProposalRecommenderType
    recommender_designation: string
    area_type: AreaType
    proposal_name: string
    sector_name: string
    sub_sector_name: string
    permissible_work: string[]
    proposal_document: string
    proposal_amount: Types.Double
    approved_by_dlc: boolean
    approved_by_nm: boolean
    proposal_status: ProposalStatus
    financial_year: string
    location: ILocation
    actionType: ProposalActionType
    remarks: string
    isDeleted: boolean
    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId
    lastActionTakenBy: Types.ObjectId
}