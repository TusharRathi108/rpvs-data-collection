export interface Sector {
    _id: string;
    sector_code: string;
    sector_name: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface SubSectorWork {
    sector_name: string;
    sub_sectors: string[];
    works: string[];
}

export interface FetchSectorsResponse {
    httpCode: number;
    status: boolean;
    message: string;
    records: Sector[];
}

export interface FetchSubSectorWorksResponse {
    httpCode: number;
    status: boolean;
    message: string;
    records: SubSectorWork[];
}