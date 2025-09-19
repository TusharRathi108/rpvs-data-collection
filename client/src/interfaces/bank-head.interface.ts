export interface BankHead {
    _id: string;
    district_id: string;
    district_code: string;
    district_name: string;
    agency_code?: string;
    agency_name?: string;
    bank_name: string;
    account_number: string;
    ifsc_code: string;
    branch_name: string;
    branch_code: string;
    createdAt: string;
    updatedAt: string;
    isDeleted?: boolean;
}

export interface CreateBankHeadRequest {
    district_id: string;
    district_code: string;
    district_name: string;

    agency_code?: string;
    agency_name?: string;
    bank_name: string;
    account_number: string;
    ifsc_code: string;
    branch_name?: string;
    branch_code: string;
}

export interface CreateBankHeadResponse {
    status: boolean;
    records: any;
    message: string;
    httpCode: number;
}

export interface BankDetails {
    _id: string
    district_id: string
    district_code: string
    district_name: string
    agency_code?: string
    agency_name?: string
    bank_name: string
    account_number: string
    ifsc_code: string
    branch_name: string
    branch_code: string
    createdAt: string
    updatedAt: string
}

export interface FetchBankHeadResponse {
    status: boolean;
    records: BankHead[];
    message: string;
    httpCode: number;
}

export interface UpdateBankHeadResponse {
    httpCode: number;
    message: string;
    status: boolean;
    records: BankHead;
}

export interface UpdateBankHeadRequest {
    district_id?: string;
    district_code?: string;
    district_name?: string;

    agency_code?: string;
    agency_name?: string;

    bank_name?: string;
    account_number?: string;
    ifsc_code?: string;
    branch_name?: string;
    branch_code?: string;

    isDeleted?: boolean;
}
