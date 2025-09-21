interface ImplementationAgency {
    _id: string;
    district_id: string;
    block_id: string;
    district_code: string;
    block_code: string;
    district_name: string;
    block_name: string;
    agency_name: string;
    financial_year: string;
}

interface CreateImplementationAgencyRequest {
    district_id: string;
    block_id: string;
    district_code: string;
    block_code: string;
    district_name: string;
    block_name: string;
    agency_name: string;
}

interface CreateImplementationAgencyResponse {
    status: boolean;
    records: ImplementationAgency;
    message: string;
    httpCode: number;
}

interface FetchImplementationAgencyResponse {
    status: boolean;
    records: ImplementationAgency[];
    message: string;
    httpCode: number;
}

interface UpdateImplementationAgencyRequest {
    district_id?: string;
    block_id?: string;
    district_code?: string;
    block_code?: string;
    district_name?: string;
    block_name?: string;
    agency_name?: string;
}

interface UpdateImplementationAgencyResponse {
    httpCode: number;
    message: string;
    status: boolean;
    records: ImplementationAgency;
}

export type {
    ImplementationAgency,
    CreateImplementationAgencyRequest,
    CreateImplementationAgencyResponse,
    FetchImplementationAgencyResponse,
    UpdateImplementationAgencyRequest,
    UpdateImplementationAgencyResponse,
}
