//* package imports
import { model, Schema, Document } from "mongoose";

//* file imports
import { IPanchayat } from "@/interfaces/location.interface";

interface PanchayatDocument extends IPanchayat, Document { }

const panchayatSchema = new Schema<PanchayatDocument>(
    {
        district_id: {
            type: Schema.ObjectId,
            ref: "districts"
        },
        block_id: {
            type: Schema.ObjectId,
            ref: "blocks"
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
        block_code: {
            type: String,
            ref: "blocks",
            required: true,
            trim: true
        },
        block_name: {
            type: String,
            required: true,
            trim: true
        },

        panchayat_code: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        panchayat_name: {
            type: String,
            required: true,
            trim: true
        },

        isActive: {
            type: Boolean,
            default: true
        },
        createdBy: {
            type: Schema.ObjectId,
            ref: "users",
            required: true
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

const PanchayatModel = model<PanchayatDocument>("panchayat", panchayatSchema);

export { PanchayatDocument, PanchayatModel };
