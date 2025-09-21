import { z } from "zod";
import { zObjectId } from "@/utils/utility-functions";

const getBankHeadBaseSchema = (role_name: string) =>
    z.object({
        district_id: zObjectId,
        agency_id:
            role_name === "District"
                ? z.string().trim().min(1, "Agency ID is required")
                : z.string().trim().optional(),
        district_code: z.string().trim().min(1, "District code is required"),
        district_name: z.string().trim().min(1, "District name is required"),

        rbo: z.string().trim().min(1, "RBO is required"),

        agency_name:
            role_name === "District"
                ? z.string().trim().min(1, "Agency name is required")
                : z.string().trim().optional(),

        bank_name: z.string().trim().min(1, "Bank name is required"),
        account_number: z
            .string()
            .trim()
            .min(6, "Account number must have at least 6 digits")
            .regex(/^[0-9]+$/, "Account number must be numeric"),
        ifsc_code: z
            .string()
            .trim()
            .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"),
        branch_name: z.string().trim().min(1, "Branch name is required"),
        branch_code: z.string().trim().min(1, "Branch code is required"),

        branch_manager_name: z.string().trim().min(1, "Branch manager is required"),
        contact_number: z
            .string()
            .trim()
            .regex(/^[0-9]{10}$/, "Contact number must be 10 digits"),

        remarks: z.string().trim().optional(),
    });

const createBankHeadSchema = (role_name: string) =>
    getBankHeadBaseSchema(role_name);

const updateBankHeadSchema = (role_name: string) =>
    getBankHeadBaseSchema(role_name);

const partialUpdateBankHeadSchema = (role_name: string) =>
    getBankHeadBaseSchema(role_name).partial();

type CreateBankHeadDto = z.infer<ReturnType<typeof createBankHeadSchema>>;
type UpdateBankHeadDto = z.infer<ReturnType<typeof updateBankHeadSchema>>;
type PartialUpdateBankHeadDto = z.infer<
    ReturnType<typeof partialUpdateBankHeadSchema>
>;

export {
    createBankHeadSchema,
    updateBankHeadSchema,
    partialUpdateBankHeadSchema,
    type CreateBankHeadDto,
    type UpdateBankHeadDto,
    type PartialUpdateBankHeadDto,
};