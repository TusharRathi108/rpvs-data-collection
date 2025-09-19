//* package imports
import { model, Schema, Document, Types } from "mongoose";

//* file imports
import { IBlock } from "@/interfaces/location.interface";

interface BlockDocument extends IBlock, Document { }

const blockSchema = new Schema<BlockDocument>(
    {
        state_id: {
            type: Schema.ObjectId,
            ref: "states",
        },
        district_id: {
            type: Schema.ObjectId,
            ref: "districts",
        },
        state_code: {
            type: String,
            ref: "states",
            required: true,
            trim: true,
        },
        district_code: {
            type: String,
            ref: "districts",
            required: true,
            trim: true,
        },
        district_name: {
            type: String,
            required: true,
            trim: true,
        },
        block_code: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        block_name: {
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

const BlockModel = model<BlockDocument>("block", blockSchema);

export { BlockDocument, BlockModel };
