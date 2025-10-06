//* package imports
import { optional, z } from "zod";

//* file imports
import { zObjectId } from "@/utils/utility-functions";
import { UserType } from "@/interfaces/enums.interface";
import { LocationSchema } from "@/schemas/location.schema";

export const CreateUserSchema = z.object({
    role_id: zObjectId,
    email: z.email(),
    username: z.string().min(3),
    password: z.string().min(6),
    user_type: z.enum(UserType),
    district_code: z.string(),
    district_name: z.string(),
    location: LocationSchema.optional(),
})

export const UpdateUserSchema = z.object({
    role_id: zObjectId.optional(),
    email: z.email().optional(),
    username: z.string().min(3).optional(),
    password: z.string().min(6).optional(),
    user_type: z.enum(UserType).optional(),
    district_code: z.string().optional(),
    district_name: z.string().optional(),
    location: LocationSchema.optional(),
});

export const BulkCreateUserSchema = z.array(CreateUserSchema);

export const PartialUpdateUserSchema = UpdateUserSchema.partial().extend({
    updatedBy: zObjectId.optional()
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type BulkCreateUserDto = z.infer<typeof BulkCreateUserSchema>;
