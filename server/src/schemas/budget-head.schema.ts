import { z } from "zod";
import { zObjectId } from "@/utils/utility-functions";

const BudgetHeadBaseSchema = z.object({
    district_id: zObjectId.optional(),
    district_code: z.string().trim().min(1).optional(),
    district_name: z.string().trim().min(1).optional(),

    allocated_budget: z.number().nonnegative().optional(),
    sanctioned_budget: z.number().nonnegative().optional(),
    // released_budget: z.number().nonnegative().optional(),
});

const CreateBudgetHeadSchema = BudgetHeadBaseSchema.extend({
    district_id: zObjectId,
    district_code: z.string().trim().min(1),
    district_name: z.string().trim().min(1),
    allocated_budget: z.number().nonnegative(),
    sanction_reference_number: z.string().trim().min(1),
    sanctioned_budget: z.number().nonnegative().optional(),
    sanctioned_budget_date: z.string().trim().transform((val) => new Date(val)),
});

const UpdateBudgetHeadSchema = BudgetHeadBaseSchema.extend({
    district_id: zObjectId,
    district_code: z.string().trim().min(1),
    district_name: z.string().trim().min(1),
    allocated_budget: z.number().nonnegative(),
    sanction_reference_number: z.string().trim().min(1),
    sanctioned_budget: z.number().nonnegative().optional(),
    sanctioned_budget_date: z.string().trim().transform((val) => new Date(val)),
    // released_budget: z.number().nonnegative().optional(),
});

const PartialUpdateBudgetHeadSchema = BudgetHeadBaseSchema.extend({
    updatedBy: zObjectId.optional(),
    lastActionTakenBy: zObjectId.optional(),
}).partial();

type CreateBudgetHeadDto = z.infer<typeof CreateBudgetHeadSchema>;
type UpdateBudgetHeadDto = z.infer<typeof UpdateBudgetHeadSchema>;
type PartialUpdateBudgetHeadDto = z.infer<typeof PartialUpdateBudgetHeadSchema>;

export {
    CreateBudgetHeadDto,
    CreateBudgetHeadSchema,
    UpdateBudgetHeadDto,
    UpdateBudgetHeadSchema,
    PartialUpdateBudgetHeadDto,
    PartialUpdateBudgetHeadSchema,
};