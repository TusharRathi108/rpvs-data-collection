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
        },
        block_id: {
            type: Schema.Types.ObjectId,
            ref: "block",
        },

        district_code: {
            type: String,
            ref: "district",
            trim: true,
        },
        block_code: {
            type: String,
            trim: true,
        },

        district_name: {
            type: String,
            ref: "block",
            trim: true,
        },
        block_name: {
            type: String,
            trim: true,
        },

        agency_name: {
            type: String,
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
