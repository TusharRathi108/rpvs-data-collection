//* package imports
import { model, Schema, Document, Types } from "mongoose";

//* file imports
import { IBank } from "@/interfaces/bank.interface";

interface BankMasterDocument extends IBank, Document { }

const bankMasterSchema = new Schema<BankMasterDocument>(
    {
        district_id: {
            type: Schema.Types.ObjectId,
            ref: "district",
            required: true,
        },
        agency_id: {
            type: Schema.Types.ObjectId,
            ref: "implementation_agency",
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

        rbo: {
            type: String,
            required: true,
            trim: true,
        },
        ifsc_code: {
            type: String,
            required: true,
            trim: true,
        },
        bank_name: {
            type: String,
            required: true,
            trim: true,
        },
        branch_code: {
            type: String,
            required: true,
            trim: true,
        },
        branch_name: {
            type: String,
            required: true,
            trim: true,
        },
        branch_manager_name: {
            type: String,
            required: true,
            trim: true,
        },
        contact_number: {
            type: Number,
            required: true,
            validate: {
                validator: (v: number) => /^[0-9]{10}$/.test(String(v)),
                message: "Contact number must be a 10-digit number",
            },
        },
        remarks: {
            type: String,
            trim: true,
            default: null,
        },

        agency_code: {
            type: String,
            trim: true,
            default: null,
        },
        agency_name: {
            type: String,
            trim: true,
            default: null,
        },

        account_number: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        lastActionTakenBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
    },
    {
        timestamps: true,
    }
);

bankMasterSchema.index({ district_id: 1, account_number: 1 }, { unique: true });

const BankMasterModel = model<BankMasterDocument>(
    "bank_master",
    bankMasterSchema
);

export { BankMasterDocument, BankMasterModel };
