//* package imports
import { model, Schema, Document } from "mongoose";

//* file imports
import { IConstituency } from "@/interfaces/location.interface";

interface ConstituencyDocument extends IConstituency, Document { }

const constituencySchema = new Schema<ConstituencyDocument>(
    {
        state_id: {
            type: Schema.ObjectId,
            ref: "states"
        },
        district_id: {
            type: Schema.ObjectId,
            ref: "districts"
        },
        state_code: {
            type: String,
            ref: 'states',
            required: true,
            trim: true,
        },
        district_code: {
            type: String,
            ref: 'districts',
            required: true,
            trim: true,
        },
        district_name: {
            type: String,
            required: true,
            trim: true,
        },
        constituency_code: {
            type: String,
            required: true,
            trim: true,
            unique: true,
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

const ConstituencyModel = model<ConstituencyDocument>(
    "constituency",
    constituencySchema
);

export { ConstituencyDocument, ConstituencyModel };
