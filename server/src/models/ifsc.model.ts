//* package imports
import { model, Schema, Document } from "mongoose"

//* file imports
import { IIfscCode } from "@/interfaces/ifsc.interface"

interface IfscCodeDocument extends IIfscCode, Document { }

const ifscCodeSchema = new Schema<IfscCodeDocument>(
    {
        district_id: { type: Schema.Types.ObjectId, ref: "district", required: true },
        district_code: { type: String, ref: "district", required: true },
        district_name: { type: String, required: true },

        rbo: { type: String, required: true, unique: true },
        ifsc_code: { type: String, required: true, unique: true },
        branch_code: { type: String, required: true },
        branch_name: { type: String, required: true },
        branch_manager_name: { type: String },

        contact_number: {
            type: Number, validate: {
                validator: function (v: number) {
                    return /^\d{10}$/.test(String(v));
                },
                message: (props) =>
                    `${props.value} is not a valid 10-digit contact number!`,
            },
        },

        remarks: { type: String },
        isDeleted: { type: Boolean, default: false },
        createdBy: { type: Schema.Types.ObjectId, ref: "user", required: true },
        updatedBy: { type: Schema.Types.ObjectId, ref: "user" },
        lastActionTakenBy: { type: Schema.Types.ObjectId, ref: "user" },
    },
    { timestamps: true }
);

const IfscCodeModel = model<IfscCodeDocument>("ifsc_code", ifscCodeSchema);

export default IfscCodeModel
