//* package imports
import { z } from "zod"

//* file imports
import { zObjectId } from "@/utils/utility-functions";

export const CreateRoleSchema = z.object({
    role_name: z.string().min(1, "Role name is required"),
    isDeleted: z.boolean().default(false),
    createdBy: zObjectId,
    updatedBy: zObjectId.optional(),
    lastActionTakenBy: zObjectId.optional()
});

export const UpdateRoleSchema = z.object({
    role_name: z.string().min(1).optional(),
    isDeleted: z.boolean().optional(),
    updatedBy: zObjectId,
    lastActionTakenBy: zObjectId.optional()
});

export const BulkCreateRoleSchema = z.array(CreateRoleSchema);
export const PartialUpdateRoleSchema = UpdateRoleSchema.partial().extend({
    updatedBy: zObjectId.optional()
});

export type CreateRoleDto = z.infer<typeof CreateRoleSchema>;
export type BulkCreateRoleDto = z.infer<typeof BulkCreateRoleSchema>;
