//* package imports
import { z } from "zod"

const budgetHeadSchema = z.object({
    district_id: z.string().min(1, "District ID is required"),
    district_code: z.string().min(1, "District code is required"),
    district_name: z.string().min(1, "District name is required"),

    allocated_budget: z
        .string()
        .min(1, "Allocated budget is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "Allocated budget must be a non-negative number",
        }),

    sanction_reference_number: z.string().min(1, "Sanctioned Referebce Number is required"),

    sanctioned_budget: z
        .string()
        .min(1, "Sanctioned budget is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "Sanctioned budget must be a non-negative number",
        }),

    sanctioned_budget_date: z.string().min(1, "Sanctioned Date is required")
}).refine(
    (data) => Number(data.sanctioned_budget) <= Number(data.allocated_budget),
    {
        message: "Sanctioned budget cannot exceed allocated budget",
        path: ["sanctioned_budget"],
    }
)

type budgetHeadFormSchema = z.infer<typeof budgetHeadSchema>;

export {
    budgetHeadSchema,
    type budgetHeadFormSchema
}
