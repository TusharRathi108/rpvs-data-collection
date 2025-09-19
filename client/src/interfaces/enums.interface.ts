export const ProposalActionType = [
    "FORWARDED",
    "SENT_BACK",
    "APPROVED",
    "REJECTED",
    "CREATED",
    "EDITED",
] as const;
export type ProposalActionType = (typeof ProposalActionType)[number];

// Local body types
export const LocalBodyType = ["MC", "NC", "NP"] as const;
export type LocalBodyType = (typeof LocalBodyType)[number];

// Proposal recommender types
export const ProposalRecommenderType = ["MLA", "OTHER"] as const;
export type ProposalRecommenderType =
    (typeof ProposalRecommenderType)[number];

// Area types
export const AreaType = ["RU", "UR"] as const;
export type AreaType = (typeof AreaType)[number];

// User roles
export const UserType = ["DISTRICT", "PLANNING"] as const;
export type UserType = (typeof UserType)[number];