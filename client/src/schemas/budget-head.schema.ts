//* package imports
import { z } from "zod"

const BudgetHeadSchema = z.object({
    district_id: z.string().min(1, "District ID is required"),
    district_code: z.string().min(1, "District code is required"),
    district_name: z.string().min(1, "District name is required"),

    allocated_budget: z
        .string()
        .min(1, "Allocated budget is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "Allocated budget must be a non-negative number",
        }),

    sanctioned_budget: z
        .string()
        .min(1, "Sanctioned budget is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "Sanctioned budget must be a non-negative number",
        }),

    released_budget: z
        .string()
        .min(1, "Released budget is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "Released budget must be a non-negative number",
        }),
});

type BudgetHeadFormValues = z.infer<typeof BudgetHeadSchema>;

export {
    BudgetHeadSchema,
    type BudgetHeadFormValues
}
