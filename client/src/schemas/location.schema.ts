//* package imports
import { z } from "zod";

//* file imports
import { AreaType, LocalBodyType } from "@/interfaces/enums.interface";

export const WardSchema = z.object({
  ward_code: z.string().optional().nullable(),
  ward_number: z.string().optional().nullable(),
  ward_name: z.string().min(1), // keep name required
  local_body_type_code: z.string().optional().nullable(),
  local_body_type_name: z.string().optional().nullable(),
});

export const VillageSchema = z.object({
  panchayat_code: z.string().optional().nullable(),
  village_code: z.string().optional().nullable(),
  village_name: z.string().min(1),
  panchayat_name: z.string().optional().nullable(),
});

export const LocationSchema = z.object({
    state_id: z.string().min(1, "State ID is required"),
    district_id: z.string().min(1, "District ID is required"),
    block_id: z.string().min(1, "Block ID is required"),
    constituency_id: z.string().min(1, "Constituency ID is required"),
    local_body_id: z.string().min(1, "Local Body ID is required"),
    panchayat_id: z.string().min(1, "Panchayat ID is required"),
    ward_id: z.array(z.string().min(1, "Ward ID is required")),
    village_id: z.array(z.string().min(1, "Village ID is required")),

    area_type: z.enum(AreaType),

    state_code: z.string().min(1),
    state_name: z.string().min(1),
    district_code: z.string().min(1),
    district_name: z.string().min(1),
    block_code: z.string().min(1),
    block_name: z.string().min(1),
    constituency_code: z.string().min(1),
    constituency_name: z.string().min(1),

    local_body_type_code: z.string().min(1),
    local_body_type_name: z.string().min(1),
    local_body_code: z.string().min(1),
    local_body_name: z.enum(LocalBodyType),

    panchayat_code: z.string().min(1),
    panchayat_name: z.string().min(1),

    wards: z.array(WardSchema).optional(),
    villages: z.array(VillageSchema).optional(),
});

export type LocationDto = z.infer<typeof LocationSchema>;