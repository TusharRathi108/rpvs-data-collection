export interface ApiError {
    status: number;
    data?: {
        status: boolean;
        error?: {
            code: string;
            message: string;
        };
        message?: string;
    };
}
