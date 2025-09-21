//* package imports 
import { z } from "zod"

//* file imports
import { contactNumberValidator } from "@/utils/utility-functions";

const CreateDepartmentSchema = z.object({
    department_name: z
        .string()
        .min(2, { message: "Department name must be at least 2 characters long" })
        .max(100, { message: "Department name must not exceed 100 characters" }),

    contact_person: z
        .string()
        .min(2, { message: "Contact person must be at least 2 characters long" })
        .max(100, { message: "Contact person must not exceed 100 characters" }),

    contact_number: contactNumberValidator,

    contact_email: z.email({ message: "Invalid email address format" }),
});

const UpdateDepartmentSchema = z.object({
    department_name: z.string().min(2).max(100).optional(),
    contact_person: z.string().min(2).max(100).optional(),
    contact_number: contactNumberValidator.optional(),
    contact_email: z.email().optional(),
});

const PartialDepartmentSchema = CreateDepartmentSchema.partial();

type CreateDepartmentDto = z.infer<typeof CreateDepartmentSchema>;
type UpdateDepartmentDto = z.infer<typeof UpdateDepartmentSchema>;
type PartialDepartmentDto = z.infer<typeof PartialDepartmentSchema>;

export {
    CreateDepartmentDto,
    CreateDepartmentSchema,
    UpdateDepartmentDto,
    UpdateDepartmentSchema,
    PartialDepartmentDto,
    PartialDepartmentSchema
}
