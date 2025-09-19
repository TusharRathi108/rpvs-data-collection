//* package imports
import { model, Schema, Document } from "mongoose";

//* file imports
import { ILocalBodyWards } from "@/interfaces/location.interface";

interface LocalBodyWardDocument extends ILocalBodyWards, Document { }

const localBodyWardSchema = new Schema<LocalBodyWardDocument>(
    {
        district_id: {
            type: Schema.ObjectId,
            ref: "districts"
        },
        local_body_type_id: {
            type: Schema.ObjectId,
            ref: "local_body_lists"
        },
        local_body_id: {
            type: Schema.ObjectId,
            ref: "local_bodies"
        },

        district_code: {
            type: String,
            required: true,
            trim: true,
        },
        local_body_type_code: {
            type: String,
            ref: "local_body_lists",
            required: true,
            trim: true,
        },
        local_body_code: {
            type: String,
            ref: "local_bodies",
            required: true,
            trim: true,
        },

        sub_district_code: {
            type: String,
            required: true,
            trim: true,
        },
        sub_district_name: {
            type: String,
            required: true,
            trim: true,
        },

        ward_code: {
            type: String,
            required: true,
            trim: true,
        },
        ward_number: {
            type: String,
            required: true,
            trim: true,
        },
        ward_name: {
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

localBodyWardSchema.index(
    { ward_code: 1 },
    { unique: true }
);

const LocalBodyWardModel = model<LocalBodyWardDocument>(
    "local_body_ward",
    localBodyWardSchema
);

export { LocalBodyWardDocument, LocalBodyWardModel };
