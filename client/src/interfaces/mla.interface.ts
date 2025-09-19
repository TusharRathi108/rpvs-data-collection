export interface IMla {
    constituency_id: string;
    constituency_code: string;
    constituency_name: string;
    type: string;
    mla_name: string;
    isActive: boolean;
    createdBy: string;
    updatedBy: string;
    lastActionBy: string;
}

export interface FetchMlaResponse {
    httpCode: number;
    status: boolean;
    message: string;
    records: IMla[];
}
