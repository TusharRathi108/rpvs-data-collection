//* package imports
import { z } from "zod";

//* file imports
import { AreaType } from "@/interfaces/enums.interface";
import { zObjectId, zObjectIdOrNull } from "@/utils/utility-functions";

const WardSchema = z.object({
  ward_code: z.string().min(1),
  ward_number: z.string().min(1),
  ward_name: z.string().min(1),
  local_body_type_code: z.string().min(1),
  local_body_type_name: z.string().min(1),
});

const VillageSchema = z.object({
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

  local_body_type_id: zObjectIdOrNull.nullable().optional(),
  local_body_id: zObjectIdOrNull.nullable().optional(),
  local_body_code: z.string().nullable().optional(),
  local_body_name: z.string().nullable().optional(),
  local_body_type_code: z.string().nullable().optional(),
  local_body_type_name: z.string().nullable().optional(),
}).loose();

const UrbanLocationSchema = BaseLocationSchema.extend({
  area_type: z.literal("UR"),

  local_body_type_id: zObjectIdOrNull.nullable().optional(),
  local_body_id: zObjectIdOrNull.nullable().optional(),
  ward_id: z.array(zObjectIdOrNull).default([]),

  local_body_type_code: z.string().nullable().optional(),
  local_body_type_name: z.string().nullable().optional(),
  local_body_code: z.string().nullable().optional(),
  local_body_name: z.string().nullable().optional(),

  block_id: zObjectIdOrNull.nullable().optional(),
  panchayat_id: zObjectIdOrNull.nullable().optional(),
  village_id: z.array(zObjectIdOrNull).default([]),

  wards: z.array(WardSchema).default([]),
  villages: z.array(VillageSchema).default([]),
}).loose();

const LocationSchema = z.discriminatedUnion("area_type", [
  RuralLocationSchema,
  UrbanLocationSchema,
]);

type LocationDto = z.infer<typeof LocationSchema>;

export {
  WardSchema,
  VillageSchema,
  BaseLocationSchema,
  RuralLocationSchema,
  UrbanLocationSchema,
  LocationSchema,
  LocationDto
}
