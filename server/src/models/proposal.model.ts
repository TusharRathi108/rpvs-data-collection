//* package imports
import { model, Schema, Document } from "mongoose";

//* file imports
import { IProposalMaster } from "@/interfaces/proposal.interface";
import { LocationSchema } from "@/models/user.model";
import { ProposalRecommenderType, ProposalActionType, AreaType, ProposalStatus } from "@/interfaces/enums.interface";
import { calculateFinancialYear } from "@/utils/utility-functions";

interface ProposalMasterDocument extends IProposalMaster, Document { }

const proposalMasterSchema = new Schema<ProposalMasterDocument>(
    {
        nodal_minister_id: {
            type: Schema.ObjectId,
            ref: "user",
        },
        sector_id: {
            type: Schema.ObjectId,
            ref: "sector",
        },
        permissible_works_id: [
            {
                type: Schema.ObjectId,
                ref: "permissible_work",
            },
        ],
        department_id: {type: Schema.Types.ObjectId, ref: 'department', trim: true, required: true},
        department_name: { type: String, trim: true, required: true },

        old_work: { type: Boolean, trim: true, default: false },
        nodal_minister: { type: String, trim: true },
        reference_number: { type: String, unique: true, trim: true },
        manual_reference_number: { type: String, trim: true },

        recommender_name: { type: String, required: true, trim: true },
        recommender_contact: { type: Number, required: true },
        recommender_email: { type: String, lowercase: true, trim: true },
        recommender_type: { type: String, enum: Object.values(ProposalRecommenderType) },
        recommender_designation: { type: String, trim: true },

        area_type: { type: String, enum: Object.values(AreaType), required: true },
        proposal_name: { type: String, required: true, trim: true },
        sector_name: { type: String, required: true, trim: true },
        sub_sector_name: { type: String, trim: true },

        permissible_work: [{ type: String, trim: true }],

        proposal_document: { type: String, trim: true },
        proposal_amount: { type: Schema.Types.Double, required: true },

        approved_by_dlc: { type: Boolean, default: false },
        approved_by_nm: { type: Boolean, default: false },

        proposal_status: { type: String, enum: Object.values(ProposalStatus), default: ProposalStatus.ACCEPTED },

        financial_year: { type: String, trim: true, default: calculateFinancialYear("full") },

        location: { type: LocationSchema, required: true },

        actionType: { type: String, enum: Object.values(ProposalActionType), default: ProposalActionType.CREATED },
        remarks: { type: String, trim: true },

        isDeleted: { type: Boolean, default: false },

        createdBy: { type: Schema.ObjectId, ref: "users", required: true },
        updatedBy: { type: Schema.ObjectId, ref: "users" },
        lastActionTakenBy: { type: Schema.ObjectId, ref: "users" },
    },
    {
        timestamps: true,
    }
);

const ProposalMasterModel = model<ProposalMasterDocument>(
    "master_proposal",
    proposalMasterSchema
);

export { ProposalMasterDocument, ProposalMasterModel };
