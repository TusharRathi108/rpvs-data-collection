export interface CreateBudgetHeadRequest {
    district_id: string;
    district_code: string;
    district_name: string;
    allocated_budget: number;
    sanction_reference_number: string;
    sanctioned_budget: number;
    sanctioned_budget_date: string
}

export interface CreateBudgetHeadResponse {
    status: boolean;
    records: any;
    message: string;
    httpCode: number;
}

export interface BudgetHead {
    _id: string;
    district_id: string;
    district_code: string;
    district_name: string;
    sanction_number: string;
    financial_year: string;
    allocated_budget: number;
    allocated_budget_date: string;
    sanction_reference_number: string
    sanctioned_budget: number;
    sanctioned_budget_date: string;
    released_budget: number;
    release_budget_date: string;
    createdAt: string;
    updatedAt: string;
}

export interface FetchBudgetHeadResponse {
    status: boolean;
    httpCode: number;
    message: string;
    records: BudgetHead[];
}

export interface FetchSingleBudgetHeadResponse {
    status: boolean;
    httpCode: number;
    message: string;
    records: BudgetHead | null;
}

export interface UpdateBudgetHeadRequest {
    budget_head_id: string;
    district_id?: string;
    district_code?: string;
    district_name?: string;
    allocated_budget?: number;
    sanctioned_budget?: number;
    released_budget?: number;
}

export interface UpdateBudgetHeadResponse {
    message: string;
    status: boolean;
    records: any;
}
