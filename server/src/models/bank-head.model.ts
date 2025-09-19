//* package imports
import { model, Schema, Document } from "mongoose";

//* file imports
import { IBankHead } from "@/interfaces/bank.interface";

interface BankHeadDocument extends IBankHead, Document { }

const bankHeadSchema = new Schema<BankHeadDocument>(
    {
        district_id: {
            type: Schema.ObjectId,
            ref: "district",
            required: true,
        },
        district_code: {
            type: String,
            ref: "district",
            required: true,
            trim: true,
        },
        district_name: {
            type: String,
            required: true,
            trim: true,
        },

        agency_code: {
            type: String,
            trim: true,
            default: null
        },
        agency_name: {
            type: String,
            trim: true,
            default: null
        },

        bank_name: {
            type: String,
            required: true,
            trim: true,
        },
        account_number: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        ifsc_code: {
            type: String,
            required: true,
            trim: true,
        },
        branch_name: {
            type: String,
            required: true,
            trim: true,
        },
        branch_code: {
            type: String,
            required: true,
            trim: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
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
        lastActionTakenBy: {
            type: Schema.ObjectId,
            ref: "users",
        },
    },
    {
        timestamps: true,
    }
);

bankHeadSchema.index(
    { account_number: 1 },
    { unique: true }
);

const BankHeadModel = model<BankHeadDocument>("bank_head", bankHeadSchema);

export { BankHeadDocument, BankHeadModel };