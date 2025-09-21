// src/schemas/department.schema.ts
import { z } from "zod";

export const createDepartmentSchema = z.object({
    department_name: z.string().min(1, "Department name is required"),
    contact_person: z.string().min(1, "Contact person name is required"),
    contact_number: z
        .string()
        .min(10, "Contact number must be at least 10 digits")
        .max(15, "Contact number must be at most 15 digits"),
    contact_email: z.email("Invalid email address"),
});

export type DepartmentFormValues = z.infer<typeof createDepartmentSchema>;
