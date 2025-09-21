export interface BankHead {
    _id: string;
    district_id: string;
    district_code: string;
    district_name: string;

    agency_id?: string;
    agency_name?: string;
    account_number: string;

    rbo: string;
    ifsc_code: string;
    branch_code: string;
    branch_name: string;
    bank_name: string;
    branch_manager_name: string;
    contact_number: string;
    remarks: string;
}

export interface CreateBankHeadRequest {
    district_id: string;
    district_code: string;
    district_name: string;

    agency_id?: string;
    agency_name?: string;
    account_number: string;

    rbo: string;
    ifsc_code: string;
    branch_code: string;
    branch_name: string;
    bank_name: string;
    branch_manager_name: string;
    contact_number: string;
    remarks: string;
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

    agency_id?: string
    agency_name?: string
    account_number: string

    rbo: string;
    ifsc_code: string;
    branch_code: string;
    branch_name: string;
    bank_name: string;
    branch_manager_name: string;
    contact_number: number;
    remarks: string;
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

    agency_id?: string;
    agency_name?: string;

    bank_name?: string;
    account_number?: string;
    ifsc_code?: string;
    branch_name?: string;
    contact_number?: string;

    branch_code?: string;

    isDeleted?: boolean;
}
