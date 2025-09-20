//* package imports
import { Types } from "mongoose";

interface IBudgetHead {
    district_id: Types.ObjectId
    district_code: string
    district_name: string

    sanction_number: string
    financial_year: string

    allocated_budget: Types.Double
    allocated_budget_date: Date

    sanctioned_budget: Types.Double
    sanctioned_budget_date: Date

    isDeleted: boolean

    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId
    lastActionTakenBy: Types.ObjectId
}

export { IBudgetHead }
