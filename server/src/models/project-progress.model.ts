//* package imports
import { model, Schema, Document } from "mongoose";

//* file imports
import { IProjectProgress } from "@/interfaces/project-progress.interface";
import { ProjectStatus } from "@/interfaces/enums.interface";

interface ProjectProgressDocument extends IProjectProgress, Document { }

const projectProgressSchema = new Schema<ProjectProgressDocument>(
    {
        proposal_id: { type: Schema.ObjectId, ref: "master_proposal", required: true },
        project_id: { type: Schema.ObjectId, ref: "master_project", required: true },
        agency_id: { type: Schema.ObjectId, ref: "implementation_agency" },
        nodal_minister: { type: Schema.ObjectId, ref: "user" },

        actual_start_date: { type: Date },
        actual_end_date: { type: Date },
        tentative_start_date: { type: Date },
        tentative_end_date: { type: Date },

        approved_by_dlc: { type: Boolean, default: false },
        document_by_dlc: [{ type: String, trim: true }],

        sent_to_nm: { type: Boolean, default: false },
        document_by_nm: [{ type: String, trim: true }],
        approved_by_nm: { type: Boolean, default: false },

        project_status: {
            type: String,
            enum: Object.values(ProjectStatus),
            default: ProjectStatus.RECEIVED,
        },

        progress: { type: Schema.Types.Double, default: 0 },

        // === IA flow ===
        sent_to_ia: { type: Boolean, default: false },
        sent_to_agency: { type: Boolean, default: false },
        concerned_agency: { type: String, trim: true },

        document_by_agency: [{ type: String, trim: true }],
        technical_eastimation_document: [{ type: String, trim: true }],
        financial_estimation_document: [{ type: String, trim: true }],

        financial_approval: { type: Boolean, default: false },
        technical_approval: { type: Boolean, default: false },
        approved_by_ia: { type: Boolean, default: false },

        // === Funds ===
        estimated_funds: { type: Schema.Types.Double, default: 0 },
        approved_funds: { type: Boolean, default: false },
        sanctioned_funds: { type: Schema.Types.Double, default: 0 },
        transferred_funds: { type: Schema.Types.Double, default: 0 },
        remaining_funds: { type: Schema.Types.Double, default: 0 },

        // === Assigned IA ===
        assigned_ia: { type: Schema.ObjectId, ref: "implementation_agency" },
        assigned_ia_name: { type: String, trim: true },

        isDeleted: { type: Boolean, default: false },

        createdBy: { type: Schema.ObjectId, ref: "users", required: true },
        updatedBy: { type: Schema.ObjectId, ref: "users" },
        lastActionTakenBy: { type: Schema.ObjectId, ref: "users", required: true },
    },
    { timestamps: true }
);

const ProjectProgressModel = model<ProjectProgressDocument>(
    "project_progress",
    projectProgressSchema
);

export { ProjectProgressDocument, ProjectProgressModel };