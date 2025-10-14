interface IPanchayatValues {
    _id: string

    district_id: string
    district_code: string
    district_name: string

    block_id: string
    block_code: string
    block_name: string

    panchayat_code: string
    panchayat_name: string
}

interface CreatePanchayatRequest {
    district_id: string
    district_code: string
    district_name: string

    block_id: string
    block_code: string
    block_name: string

    panchayat_name: string
}

interface CreatePanchayatResponse {
    status: boolean
    records: IPanchayatValues
    message: string
    httpCode: number
}

interface FetchPanchayatValues {
    status: boolean
    records: IPanchayatValues[]
    message: string
    httpCode: number
}

interface UpdatePanchayatRequest {
    panchayat_name: string
}

interface UpdatePanchayatResponse {
    status: boolean
    records: IPanchayatValues
    message: string
    httpCode: string
}

export type {
    IPanchayatValues,

    CreatePanchayatRequest,
    CreatePanchayatResponse,

    FetchPanchayatValues,

    UpdatePanchayatRequest,
    UpdatePanchayatResponse
}
