import { Types } from "mongoose"

export interface IRole {
    role_name: string
    isDeleted: boolean
    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId
    lastActionTakenBy: Types.ObjectId
}
