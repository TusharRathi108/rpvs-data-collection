export interface SessionUser {
    user_id: string;
    username: string;
    email: string;
    role_name: string | null;
    district_code: string | null;
    district_name: string | null;
    state_code: string;
    state_name: string;
    district?: {
        district_id: string;
        district_code: string;
        district_name: string;
        state_code: string;
        state_name: string;
    } | null;
    password_reset: boolean
}

declare global {
    namespace Express {
        interface User extends SessionUser { }
    }
}

export { };
