export interface Department {
    _id: string;
    department_name: string;
    contact_person: string;
    contact_number: string;
    contact_email: string;
}

export interface CreateDepartmentRequest {
    department_name: string;
    contact_person: string;
    contact_number: string;
    contact_email: string;
}

export interface CreateDepartmentResponse {
    status: boolean;
    records: any;
    message: string;
    httpCode: number;
}

export interface FetchDepartmentResponse {
    status: boolean;
    records: Department[];
    message: string;
    httpCode: number;
}

export interface UpdateDepartmentRequest {
    department_name?: string;
    contact_person?: string;
    contact_number?: string;
    contact_email?: string;
    isDeleted?: boolean;
}

export interface UpdateDepartmentResponse {
    httpCode: number;
    message: string;
    status: boolean;
    records: Department;
}