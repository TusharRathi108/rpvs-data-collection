//* package imports
import { Types } from "mongoose"

//* file imports
import { AreaType } from "@/interfaces/enums.interface"

interface IWard {
    ward_code: string
    ward_number: string
    ward_name: string
    local_body_type_code: string
    local_body_type_name: string
}

interface IVillage {
    panchayat_code: string
    village_code: string
    village_name: string
    panchayat_name: string
}

interface ILocation {
    state_id: Types.ObjectId
    district_id: Types.ObjectId
    block_id: Types.ObjectId
    constituency_id: Types.ObjectId
    local_body_id: Types.ObjectId
    panchayat_id: Types.ObjectId
    ward_id: Types.ObjectId[]
    village_id: Types.ObjectId[]
    area_type: AreaType
    state_code: string
    state_name: string
    district_code: string
    district_name: string
    block_code: string
    block_name: string
    constituency_code: string
    constituency_name: string
    local_body_type_code: string
    local_body_type_name: string
    local_body_code: string
    local_body_name: string
    panchayat_code: string
    panchayat_name: string
    wards?: IWard[]
    villages?: IVillage[]
}

interface IState {
    lgd_state_code: string,
    state_name: string,
    isActive: boolean
    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId
    lastActionBy: Types.ObjectId
}

interface IDistrict {
    state_id: Types.ObjectId,
    state_code: string,
    state_name: string,
    district_code: string,
    district_name: string,
    short_name_district: string,
    isActive: boolean
    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId
    lastActionBy: Types.ObjectId
}

interface IBlock {
    state_id: Types.ObjectId
    district_id: Types.ObjectId
    state_code: string
    district_code: string
    district_name: string
    block_code: string
    block_name: string
    isActive: boolean
    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId
    lastActionBy: Types.ObjectId
}

interface IConstituency {
    state_id: Types.ObjectId
    district_id: Types.ObjectId
    state_code: string,
    district_code: string
    district_name: string
    constituency_code: string
    constituency_name: string
    type: string
    isActive: boolean
    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId
    lastActionBy: Types.ObjectId
}

interface IPanchayat {
    district_id: Types.ObjectId
    block_id: Types.ObjectId

    district_code: string
    district_name: string
    block_code: string
    block_name: string

    panchayat_code: string
    panchayat_name: string

    isActive: boolean
    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId
    lastActionBy: Types.ObjectId
}

interface IPancahaytVillage {
    district_id: Types.ObjectId
    block_id: Types.ObjectId
    panchayat_id: Types.ObjectId

    district_code: string
    district_name: string
    block_code: string
    block_name: string
    panchayat_code: string
    panchayat_name: string

    village_code: string
    village_name: string
    hadbast_village_name: string
    hadbast_number: string

    isActive: boolean
    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId
    lastActionBy: Types.ObjectId
}

interface ILocalBodyList {
    local_body_type_name: string
    local_body_type_code: string
    isActive: boolean
    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId
    lastActionBy: Types.ObjectId
}

interface ILocalBody {
    district_id: Types.ObjectId
    local_body_type_id: Types.ObjectId
    district_code: string
    district_name: string
    local_body_type_code: string
    local_body_type_name: string
    local_body_code: string
    local_body_name: string
    isActive: boolean
    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId
    lastActionBy: Types.ObjectId
}

interface ILocalBodyWards {
    district_id: Types.ObjectId,
    local_body_type_id: Types.ObjectId
    local_body_id: Types.ObjectId

    district_code: string
    local_body_type_code: string
    local_body_code: string

    sub_district_code: string
    sub_district_name: string
    ward_code: string
    ward_number: string
    ward_name: string

    isActive: boolean
    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId
    lastActionBy: Types.ObjectId
}

export {
    IWard,
    ILocation,
    IVillage,
    IDistrict,
    IState,
    IBlock,
    IConstituency,
    IPanchayat,
    IPancahaytVillage,
    ILocalBodyList,
    ILocalBody,
    ILocalBodyWards
}
