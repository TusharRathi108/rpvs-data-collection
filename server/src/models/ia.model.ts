//* package imports
import { model, Schema, Document, Types } from "mongoose";

//* file imports
import { IImplementationAgency } from "@/interfaces/ia.interface";
import { calculateFinancialYear } from "@/utils/utility-functions";

interface IImplementationAgencyDocument extends IImplementationAgency, Document { }

const implementationAgencySchema = new Schema<IImplementationAgencyDocument>(
    {
        district_id: {
            type: Schema.Types.ObjectId,
            ref: "district",
            required: true,
        },
        block_id: {
            type: Schema.Types.ObjectId,
            ref: "block",
            required: true,
        },

        district_code: {
            type: String,
            ref: "district",
            trim: true,
            required: true,
        },
        block_code: {
            type: String,
            required: true,
            trim: true,
        },

        district_name: {
            type: String,
            ref: "block",
            trim: true,
            required: true,
        },
        block_name: {
            type: String,
            required: true,
            trim: true,
        },

        agency_name: {
            type: String,
            required: true,
            trim: true,
        },
        financial_year: {
            type: String,
            required: true,
            default: calculateFinancialYear("full")
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        lastActionTakenBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
    },
    {
        timestamps: true,
    }
);

const ImplementationAgencyModel = model<IImplementationAgencyDocument>(
    "implementation_agency",
    implementationAgencySchema
);

export { IImplementationAgencyDocument, ImplementationAgencyModel };
