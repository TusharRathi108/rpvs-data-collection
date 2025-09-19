//* package imports
import { model, Schema, Document } from "mongoose"

//* file imports
import { IState } from "@/interfaces/location.interface"

interface StateDocument extends IState, Document { }

const stateSchema = new Schema<StateDocument>(
    {
        lgd_state_code: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        state_name: {
            type: String,
            required: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        lastActionBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const StateModel = model<StateDocument>('state', stateSchema)

export { StateDocument, StateModel }
