import { z } from "zod";
import { zObjectId } from "@/utils/utility-functions";
import { AreaType, LocalBodyType } from "@/interfaces/enums.interface";

const zObjectIdOrNull = z
  .string()
  .refine((val) => val === "" || /^[a-f\d]{24}$/i.test(val), {
    message: "Invalid ObjectId",
  })
  .transform((val) => (val === "" ? null : val));

export const WardSchema = z.object({
    ward_code: z.string().min(1),
    ward_number: z.string().min(1),
    ward_name: z.string().min(1),
    local_body_type_code: z.string().min(1),
    local_body_type_name: z.string().min(1),
});

export const VillageSchema = z.object({
    panchayat_code: z.string().min(1),
    village_code: z.string().min(1),
    village_name: z.string().min(1),
    panchayat_name: z.string().min(1),
});

const BaseLocationSchema = z.object({
    state_id: zObjectId,
    district_id: zObjectId,
    constituency_id: zObjectId,
    area_type: z.enum(AreaType),

    state_code: z.string().min(1),
    state_name: z.string().min(1),
    district_code: z.string().min(1),
    district_name: z.string().min(1),
    constituency_code: z.string().min(1),
    constituency_name: z.string().min(1),
});

const RuralLocationSchema = BaseLocationSchema.extend({
  area_type: z.literal("RU"),

  block_id: zObjectIdOrNull.nullable().optional(),
  panchayat_id: zObjectIdOrNull.nullable().optional(),
  village_id: z.array(zObjectIdOrNull).default([]),

  block_code: z.string().nullable().optional(),
  block_name: z.string().nullable().optional(),
  panchayat_code: z.string().nullable().optional(),
  panchayat_name: z.string().nullable().optional(),

  villages: z.array(VillageSchema).default([]),
  wards: z.array(WardSchema).default([]),

  local_body_id: zObjectIdOrNull.nullable().optional(),
  local_body_code: z.string().nullable().optional(),
  local_body_name: z.string().nullable().optional(),
  local_body_type_code: z.string().nullable().optional(),
  local_body_type_name: z.string().nullable().optional(),
}).loose();

const UrbanLocationSchema = BaseLocationSchema.extend({
  area_type: z.literal("UR"),

  local_body_id: zObjectIdOrNull.nullable().optional(),
  ward_id: z.array(zObjectIdOrNull).default([]),

  local_body_type_code: z.string().nullable().optional(),
  local_body_type_name: z.string().nullable().optional(),
  local_body_code: z.string().nullable().optional(),
  local_body_name: z.string().nullable().optional(),

  wards: z.array(WardSchema).default([]),
  villages: z.array(VillageSchema).default([]),
}).loose();

export const LocationSchema = z.discriminatedUnion("area_type", [
  RuralLocationSchema,
  UrbanLocationSchema,
]);

export type LocationDto = z.infer<typeof LocationSchema>;