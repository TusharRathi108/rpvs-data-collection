export interface GenerateProposalRefInput {
    stateCode: string;
    districtCode: string | null | undefined;
    blockCode: string | null;
    constituencyCode: string;
    panchayatCode?: string | null;
    localBodyType?: string | null;
    localBodyCode?: string | null;
    financialYear: string;
    running_number: string;
}

export interface GenerateProjectRefInput {
    proposalRef: string;
    projectName: string;
}

export function getInitials(name: string) {
    return name
        .split(/\s+/)
        .map(word => word[0]?.toUpperCase())
        .join('');
}

export function generateProposalRef({
    stateCode,
    districtCode,
    blockCode,
    constituencyCode,
    panchayatCode,
    localBodyType,
    localBodyCode,
    financialYear,
    running_number
}: GenerateProposalRefInput) {

    if (panchayatCode) {
        return `${stateCode}/${districtCode}/${blockCode}/${constituencyCode}/${panchayatCode}/${financialYear}/${running_number}`;
    }

    if (localBodyType) {
        return `${stateCode}/${districtCode}/${constituencyCode}/${localBodyType}/${localBodyCode}/${financialYear}/${running_number}`;
    }
}

export function generateProjectRef({
    proposalRef,
    projectName,
}: GenerateProjectRefInput) {
    const projectInitials = getInitials(projectName);
    return `${proposalRef}/PROJ_${projectInitials}`;
}
