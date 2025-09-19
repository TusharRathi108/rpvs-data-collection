//* package imports
import { model, Schema, Document } from "mongoose";

//* file imports
import { ILocalBody } from "@/interfaces/location.interface";

interface LocalBodyDocument extends ILocalBody, Document { }

const localBodySchema = new Schema<LocalBodyDocument>(
    {
        district_id: {
            type: Schema.ObjectId,
            ref: "districts",
        },
        local_body_type_id: {
            type: Schema.ObjectId,
            ref: "local_body_lists",
        },
        district_code: {
            type: String,
            ref: "districts",
            required: true,
            trim: true
        },
        district_name: {
            type: String,
            required: true,
            trim: true
        },
        local_body_type_code: {
            type: String,
            ref: "local_body_lists",
            required: true,
            trim: true,
        },
        local_body_type_name: {
            type: String,
            required: true,
            trim: true,
        },
        local_body_code: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        local_body_name: {
            type: String,
            required: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: Schema.ObjectId,
            ref: "users",
            required: true,
        },
        updatedBy: {
            type: Schema.ObjectId,
            ref: "users"
        },
        lastActionBy: {
            type: Schema.ObjectId,
            ref: "users"
        },
    },
    {
        timestamps: true,
    }
);

localBodySchema.index(
    { local_body_type_id: 1, local_body_code: 1 },
    { unique: true }
);

const LocalBodyModel = model<LocalBodyDocument>("local_body", localBodySchema);

export { LocalBodyDocument, LocalBodyModel };