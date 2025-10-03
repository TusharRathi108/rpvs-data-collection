import { Types } from "mongoose"
import { UserType } from "@/interfaces/enums.interface"
import { ILocation } from "@/interfaces/location.interface"

interface IUser {
    role_id: Types.ObjectId
    email: string
    username: string
    password: string
    user_type: UserType
    district_code: string
    district_name: string
    location: ILocation
    isDeleted: boolean
    password_reset: boolean
    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId
    lastActionTakenBy: Types.ObjectId
}

interface IMla {
    constituency_id: Types.ObjectId
    constituency_code: string
    constituency_name: string
    type: string
    mla_name: string
    isActive: boolean
    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId
    lastActionBy: Types.ObjectId
}

export { IUser, IMla }
