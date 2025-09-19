//* package imports
import { model, Schema, Document, Types } from "mongoose";

//* file imports
import { IMla } from "@/interfaces/user.interface";

interface MlaDocument extends IMla, Document { }

const mlaSchema = new Schema<MlaDocument>(
    {
        constituency_id: {
            type: Schema.ObjectId,
            ref: "constituencie",
        },
        constituency_code: {
            type: String,
            ref: "constituencie",
            required: true,
            trim: true,
        },
        constituency_name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["Gen", "Sc"],
            required: true,
        },
        mla_name: {
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
            ref: "users",
            required: true,
        },
        lastActionBy: {
            type: Schema.ObjectId,
            ref: "users",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const MlaModel = model<MlaDocument>("mla", mlaSchema);

export { MlaDocument, MlaModel };
