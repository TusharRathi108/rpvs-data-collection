import { z } from "zod";

export const createIAMasterSchema = z.object({
    financial_year: z.string().min(4, "Financial year is required"),
    district_id: z.string().min(1, "District is required"),
    block_id: z.string().min(1, "Block is required"),
    agency_name: z.string().min(1, "Agency name is required"),
});

export type IAMasterFormValues = z.infer<typeof createIAMasterSchema>;
