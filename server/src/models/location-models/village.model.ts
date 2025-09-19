//* package imports
import { model, Schema, Document } from "mongoose";

//* file imports
import { IPancahaytVillage } from "@/interfaces/location.interface";

interface PanchayatVillageDocument extends IPancahaytVillage, Document { }

const panchayatVillageSchema = new Schema<PanchayatVillageDocument>(
    {
        district_id: {
            type: Schema.ObjectId,
            ref: "districts"
        },
        block_id: {
            type: Schema.ObjectId,
            ref: "blocks"
        },
        panchayat_id: {
            type: Schema.ObjectId,
            ref: "panchayats"
        },

        district_code: {
            type: String,
            ref: "districts",
            required: true,
            trim: true,
        },
        district_name: {
            type: String,
            trim: true,
        },
        block_code: {
            type: String,
            ref: "blocks",
            required: true,
            trim: true,
        },
        block_name: {
            type: String,
            trim: true,
        },
        panchayat_code: {
            type: String,
            ref: "panchayats",
            required: true,
            trim: true,
        },
        panchayat_name: {
            type: String,
            trim: true,
        },

        village_code: {
            type: String,
            required: true,
            trim: true,
        },
        village_name: {
            type: String,
            trim: true,
        },
        hadbast_village_name: {
            type: String,
            trim: true
        },
        hadbast_number: {
            type: String,
            trim: true
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
        },
        lastActionBy: {
            type: Schema.ObjectId,
            ref: "users",
        },
    },
    {
        timestamps: true,
    }
);

panchayatVillageSchema.index(
    { panchayat_code: 1, village_code: 1 },
    { unique: true }
);

const PanchayatVillageModel = model<PanchayatVillageDocument>(
    "panchayat_village",
    panchayatVillageSchema
);

export { PanchayatVillageDocument, PanchayatVillageModel };
