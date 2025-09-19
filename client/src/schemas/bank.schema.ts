//* package imports
import { z } from "zod";

const createBankMasterSchema = (role_name: string, isEdit = false) => {
    const baseSchema = {
        district_id: isEdit
            ? z.string().optional()
            : z.string().min(1, "District is required"),

        district_code: z.string().optional(),
        district_name: z.string().optional(),

        bank_name: z.string().min(1, "Bank name is required"),
        account_number: z.string().min(6, "Account number is required"),
        ifsc_code: z.string().min(1, "IFSC code is required"),
        branch_name: z.string().min(1, "Branch name is required"),
    };

    if (role_name === "District") {
        return z.object({
            ...baseSchema,
            agency_code: z.string().min(1, "Agency code is required"),
            agency_name: z.string().min(1, "Agency name is required"),
        });
    }

    return z.object({
        ...baseSchema,
        agency_code: z.string().optional(),
        agency_name: z.string().optional(),
    });
};

//* Infer the form values type from the schema factory
type BankMasterFormValues = z.infer<ReturnType<typeof createBankMasterSchema>>;

export { createBankMasterSchema, type BankMasterFormValues };