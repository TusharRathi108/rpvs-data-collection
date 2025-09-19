//* package imports
import { model, Schema, Document } from "mongoose";

//* file imports
import { ILocalBodyList } from "@/interfaces/location.interface";

interface LocalBodyListDocument extends ILocalBodyList, Document { }

const localBodyListSchema = new Schema<LocalBodyListDocument>(
    {
        local_body_type_name: {
            type: String,
            required: true,
            trim: true,
        },
        local_body_type_code: {
            type: String,
            required: true,
            trim: true,
            unique: true,
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
            ref: "users"
        },
        lastActionBy: {
            type: Schema.ObjectId,
            ref: "users"
        },
    },
    {
        timestamps: true,
    }
);

const LocalBodyListModel = model<LocalBodyListDocument>(
    "local_body_list",
    localBodyListSchema
);

export { LocalBodyListDocument, LocalBodyListModel };
