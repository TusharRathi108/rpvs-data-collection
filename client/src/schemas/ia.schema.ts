import { z } from "zod";

export const createIAMasterSchema = z.object({
    district_id: z.string().min(1, "District is required"),
    block_id: z.string().optional(),
    agency_name: z.string().min(1, "Agency name is required"),
});

export type IAMasterFormValues = z.infer<typeof createIAMasterSchema>;
