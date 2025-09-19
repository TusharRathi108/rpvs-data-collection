//* package imports
import { model, Schema, Document, Types } from "mongoose";

//* file imports
import { IDistrict } from "@/interfaces/location.interface";

interface DistrictDocument extends IDistrict, Document { }

const districtSchema = new Schema<DistrictDocument>(
    {
        state_id: {
            type: Schema.ObjectId,
            ref: "states",
            required: true,
        },
        state_code: {
            type: String,
            required: true,
            trim: true,
        },
        state_name: {
            type: String,
            required: true,
            trim: true,
        },
        district_code: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        district_name: {
            type: String,
            required: true,
            trim: true,
        },
        short_name_district: {
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

const DistrictModel = model<DistrictDocument>("district", districtSchema);

export { DistrictDocument, DistrictModel };