interface IVillageValues {
    _id: string

    district_id: string
    district_code: string
    district_name: string

    block_id: string
    block_code: string
    block_name: string

    panchayat_id: string
    panchayat_code: string
    panchayat_name: string

    village_name: string
    hadbast_number: string
}

interface CreateVillageRequest {
    district_id: string
    district_code: string
    district_name: string

    block_id: string
    block_code: string
    block_name: string

    panchayat_id: string
    panchayat_code: string
    panchayat_name: string

    village_name: string
    hadbast_number: string
}

interface CreateVillageResponse {
    status: boolean
    records: IVillageValues
    message: string
    httpCode: number
}

interface FetchVillageValues {
    status: boolean
    records: IVillageValues[]
    message: string
    httpCode: number
}

interface UpdateVillageRequest {
    village_name: string
    hadbast_number: string
}

interface UpdateVillageResponse {
    status: boolean
    records: IVillageValues
    message: string
    httpCode: string
}

export type {
    IVillageValues,

    CreateVillageRequest,
    CreateVillageResponse,

    FetchVillageValues,

    UpdateVillageRequest,
    UpdateVillageResponse
}
