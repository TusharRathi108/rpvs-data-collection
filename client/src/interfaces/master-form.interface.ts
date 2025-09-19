export interface District {
    _id: string;
    district_code: string;
    district_name: string;
}

export interface HeadFormProps<T = any> {
    districts: { _id: string; district_code: string; district_name: string }[];
    isLoading: boolean;
    initialData?: Partial<T> | null;
    onSuccess?: () => void;
}