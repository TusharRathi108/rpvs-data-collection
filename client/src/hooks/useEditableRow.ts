//* package imports
import { useState } from "react";

export function useEditableRow<T extends { _id: string }>() {
    const [editingRow, setEditingRow] = useState<T | null>(null);

    const handleToggleEdit = (row: T) => {
        if (editingRow?._id === row._id) {
            setEditingRow(null);
        } else {
            setEditingRow(row);
        }
    };

    const cancelEdit = () => setEditingRow(null);

    return { editingRow, handleToggleEdit, cancelEdit };
}