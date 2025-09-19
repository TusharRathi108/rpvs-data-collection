//* package imports
import mongoose, { Schema, Types, model } from "mongoose";

//* file imports
import { ISectorMaster } from "@/interfaces/sector.interface";

const isStringArray = (arr: unknown[]): boolean =>
    arr.every((v) => typeof v === "string");

const isObjArrayWithWorks = (arr: unknown[]): boolean =>
    arr.every(
        (v) =>
            v !== null &&
            typeof v === "object" &&
            typeof (v as any).sub_sector === "string" &&
            Array.isArray((v as any).works) &&
            (v as any).works.every((w: any) => typeof w === "string")
    );

const permissibleWorksValidator = (val: unknown): boolean => {
    if (!Array.isArray(val)) return false;

    return isStringArray(val) || isObjArrayWithWorks(val);
};

const sectorSchema = new Schema<ISectorMaster>(
    {
        department_id: {
            type: Schema.Types.ObjectId,
            ref: "department",
            required: true,
            index: true,
        },
        sector_name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        permissible_works: {
            type: Schema.Types.Mixed,
            required: true,
            default: [],
            validate: {
                validator: permissibleWorksValidator,
                message: "permissible_works must be either string[] OR { sub_sector: string, works: string[] }[]."
            },
        } as unknown as mongoose.SchemaDefinitionProperty<ISectorMaster["permissible_works"]>,
        isDeleted: { type: Boolean, default: false },
        createBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
        updatedBy: { type: Schema.Types.ObjectId, ref: "users", default: null },
    },
    {
        timestamps: true,
    }
);

sectorSchema.index(
    { department_id: 1, sector_name: 1, isDeleted: 1 },
    { unique: true, partialFilterExpression: { isDeleted: false } }
);

const SectorModel = model<ISectorMaster>("sector", sectorSchema);

export default SectorModel
