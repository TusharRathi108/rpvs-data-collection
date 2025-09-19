//* package imports
import { Document, model, Schema, Types } from 'mongoose';

//* file imports
import { IUser } from '@/interfaces/user.interface';
import { ILocation, IVillage, IWard } from '@/interfaces/location.interface';
import { AreaType, UserType, LocalBodyType } from '@/interfaces/enums.interface';

interface UserDocument extends IUser, Document {
    _id: Types.ObjectId;
}

const WardSchema = new Schema<IWard>(
    {
        ward_code: { type: String, required: true, trim: true },
        ward_number: { type: String, required: true, trim: true },
        ward_name: { type: String, required: true, trim: true },
        local_body_type_code: { type: String, required: true, trim: true },
        local_body_type_name: { type: String, required: true, trim: true }
    },
    { _id: false }
);

const VillageSchema = new Schema<IVillage>(
    {
        village_code: { type: String, required: true, trim: true },
        village_name: { type: String, required: true, trim: true },
        panchayat_code: { type: String, required: true, trim: true },
        panchayat_name: { type: String, required: true, trim: true }
    },
    { _id: false }
);

const LocationSchema = new Schema<ILocation>(
    {
        state_id: { type: Schema.ObjectId, ref: "states" },
        district_id: { type: Schema.ObjectId, ref: "districts" },
        block_id: { type: Schema.ObjectId, ref: "blocks" },
        constituency_id: { type: Schema.ObjectId, ref: "constituencies" },
        local_body_id: { type: Schema.ObjectId, ref: "local_body" },
        panchayat_id: { type: Schema.ObjectId, ref: "panchayats" },

        ward_id: [{ type: Types.ObjectId, ref: "local_body_ward" }],
        village_id: [{ type: Types.ObjectId, ref: "panchayat_village" }],

        state_code: { type: String, trim: true },
        state_name: { type: String, trim: true },
        district_code: { type: String, trim: true },
        district_name: { type: String, trim: true },
        block_code: { type: String, trim: true },
        block_name: { type: String, trim: true },

        area_type: { type: String, enum: Object.values(AreaType) },

        local_body_type_code: { type: String, trim: true },
        local_body_type_name: { type: String, trime: true },
        local_body_code: { type: String, trim: true },
        local_body_name: { type: String, trim: true },

        constituency_code: { type: String, trim: true },
        constituency_name: { type: String, trim: true },

        panchayat_code: { type: String, trim: true },
        panchayat_name: { type: String, trim: true },

        wards: [WardSchema],
        villages: [VillageSchema]
    },
    { _id: false }
);

const userSchema = new Schema<UserDocument>(
    {
        role_id: { type: Schema.ObjectId, ref: "role", required: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        username: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true },
        user_type: { type: String, enum: Object.values(UserType), required: true },
        district_code: { type: String, required: true },
        district_name: { type: String, required: true },
        location: {
            type: LocationSchema, default: {}
        },
        isDeleted: { type: Boolean, default: false },
        createdBy: { type: Schema.ObjectId, required: true },
        updatedBy: { type: Schema.ObjectId, default: null },
        lastActionTakenBy: { type: Schema.ObjectId, default: null }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const UserModel = model<UserDocument>('user', userSchema)

export { LocationSchema, UserDocument, UserModel, VillageSchema, WardSchema };
