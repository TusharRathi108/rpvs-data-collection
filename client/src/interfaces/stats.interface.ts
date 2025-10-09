export interface DistrictProposalStats {
    district_code?: string;
    district_name: string;
    proposal_entered_count: number;
}

export interface DistrictProposalStatsResponse {
    httpCode: number;
    message: string;
    status: boolean;
    records: DistrictProposalStats[];
}