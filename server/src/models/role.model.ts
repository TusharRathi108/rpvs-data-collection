//* package imports
import { model, Schema, Document, Types } from "mongoose"

//* file imports
import { IRole } from "@/interfaces/role.interface";

interface RoleDocument extends IRole, Document { }

const roleSchema = new Schema<RoleDocument>({
    role_name: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: 'users',
        required: true
    },
    updatedBy: {
        type: Schema.ObjectId,
        ref: 'users',
    },
    lastActionTakenBy: {
        type: Schema.ObjectId,
        ref: 'users',
    }
}, { timestamps: true })

const RoleModel = model<RoleDocument>('role', roleSchema)

export { RoleDocument, RoleModel }
