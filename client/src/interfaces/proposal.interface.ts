import type { ProposalFormValues } from "@/schemas/proposal.schema";

export interface CreateProposalRequest extends ProposalFormValues { }

export interface CreateProposalResponse {
    message: string;
    status: boolean;
    records: IProposal;
}

export interface FetchProposalResponse {
    message: string;
    status: boolean;
    records: IProposal[];
}

export interface FetchSingleProposalResponse {
    message: string;
    status: boolean;
    records: IProposal | null;
}

export interface UpdateProposalRequest {
    proposal_id: string;
    data: Partial<ProposalFormValues>;
}

export interface UpdateProposalResponse {
    message: string;
    status: boolean;
    records: IProposal;
}

export interface IProposal extends ProposalFormValues {
    _id: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy?: string;
    lastActionTakenBy: string;
    isDeleted: boolean;
}