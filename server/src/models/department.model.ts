//* package imports
import { model, Schema, Document, Types } from "mongoose";

//* file imports
import { IDepartment } from "@/interfaces/department.interface";

interface DepartmentDocument extends IDepartment, Document { }

const departmentSchema = new Schema<DepartmentDocument>(
    {
        department_name: {
            type: String,
            required: true,
            trim: true,
        },
        contact_person: {
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
        contact_email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
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
        lasteActionTakenBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
    },
    {
        timestamps: true,
    }
);

const DepartmentModel = model<DepartmentDocument>(
    "department",
    departmentSchema
);

export { DepartmentDocument, DepartmentModel };