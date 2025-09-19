import type { ColumnDef } from "@tanstack/react-table";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchKey?: string;
    showColumnSelector?: boolean;
    showPagination?: boolean;
    onEdit?: (row: TData) => void;
}

export { type DataTableProps }
