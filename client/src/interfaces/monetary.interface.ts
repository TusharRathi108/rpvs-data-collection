interface IIfscCode {
    _id: string;

    district_id: string;
    district_code: string;
    district_name: string;

    rbo: string;
    ifsc_code: string;

    branch_code: string;
    branch_name: string;

    bank_name: string;

    branch_manager_name: string;
    contact_number: number;
    remarks: string;
}

interface IFetchIfscCodeResponse {
    httpCode: number
    message: string,
    records: IIfscCode[]
    status: boolean
}

export { type IFetchIfscCodeResponse }
