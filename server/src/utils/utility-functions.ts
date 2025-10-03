//* package imports
import { randomInt } from "crypto";
import { SortOrder, Types } from "mongoose";
import { z, ZodObject, ZodRawShape } from "zod";

export const zObjectId = z
    .string()
    .refine((value) => Types.ObjectId.isValid(value), {
        message: "Invalid ObjectId",
    })
    .transform((value) => new Types.ObjectId(value));

export const contactNumberValidator = z
    .string()
    .regex(/^\d{10}$/, { message: "Contact number must be exactly 10 digits" });

export const istDateSchema = z
    .union([z.string(), z.null(), z.undefined()])
    .transform((val) => parseISTDate(val))
    .refine((d) => d === null || d instanceof Date, {
        message: "Invalid date format",
    });

export const asArray = <T>(x: T | T[]) => (Array.isArray(x) ? x : [x]);

export const toObjectId = (value: string | Types.ObjectId): Types.ObjectId =>
    typeof value === "string" ? new Types.ObjectId(value) : value;

export function generateOtp() {
    return String(randomInt(0, 1_000_000)).padStart(6, '0')
}

export const parseISTDate = (value: string | null | undefined): Date | null => {
    if (!value) return null;

    const trimmed = value.trim();
    if (!trimmed) return null;

    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(trimmed);

    if (isDateOnly) {
        return new Date(`${trimmed}T00:00:00+05:30`);
    }

    const parsed = new Date(trimmed);
    return isNaN(parsed.getTime()) ? null : parsed;
};

export const rejectFields = <T extends ZodRawShape>(
    schema: ZodObject<T>,
    forbiddenFields: (keyof T | string)[]
) =>
    schema.superRefine((data: unknown, ctx) => {
        if (typeof data !== "object" || data === null) return;

        const input = data as Record<string, unknown>;

        forbiddenFields.forEach((field) => {
            if (field in input) {
                ctx.addIssue({
                    path: [field],
                    code: "custom",
                    message: `Field '${String(field)}' is not allowed at this stage.`,
                });
            }
        });
    });

export function calculateFinancialYear(format: "full" | "short" = "full"): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();

    const startYear = month < 3 ? year - 1 : year;
    const endYear = startYear + 1;

    if (format === "short") {
        return `${startYear.toString().slice(-2)}-${endYear.toString().slice(-2)}`;
    }

    return `${startYear}-${endYear.toString().slice(-2)}`;
}

export function normalizeSort<Order extends Record<string, SortOrder>>(
    sort: Order
): Record<string, 1 | -1> {
    return Object.fromEntries(
        Object.entries(sort).map(([key, value]) => {
            const isAsc =
                value === 1 ||
                value === 'asc' ||
                value === 'ascending';
            return [key, isAsc ? 1 : -1];
        })
    );
}

export function parseDuration(duration: string): number {
    const match = duration.match(/^(\d+)([smhdy])$/i)
    if (!match) {
        throw new Error("Invalid duration format");
    }

    const num = match[1];
    const unit = match[2];

    if (!num || !unit) {
        throw new Error("Invalid duration components");
    }

    const value = parseInt(num, 10);

    switch (unit) {
        case "s": return value * 1000;
        case "m": return value * 60 * 1000;
        case "h": return value * 60 * 60 * 1000;
        case "d": return value * 24 * 60 * 60 * 1000;
        case "y": return value * 365 * 24 * 60 * 60 * 1000;
        default: throw new Error("Unsupported time unit");
    }
}

export function sanitizeLocation(location: any) {
    if (!location) return location;

    // --- helper to normalize values ---
    const normalizeObjectId = (val: any) =>
        val && typeof val === "string" && val.trim() !== "" ? val : null;

    const normalizeString = (val: any) =>
        typeof val === "string" ? val.trim() : "";

    const normalizeArray = (val: any) =>
        Array.isArray(val) ? val : [];

    // --- common fields ---
    location.state_id = normalizeObjectId(location.state_id);
    location.district_id = normalizeObjectId(location.district_id);
    location.constituency_id = normalizeObjectId(location.constituency_id);

    location.state_code = normalizeString(location.state_code);
    location.state_name = normalizeString(location.state_name);
    location.district_code = normalizeString(location.district_code);
    location.district_name = normalizeString(location.district_name);
    location.constituency_code = normalizeString(location.constituency_code);
    location.constituency_name = normalizeString(location.constituency_name);

    location.village_id = normalizeArray(location.village_id);
    location.ward_id = normalizeArray(location.ward_id);
    location.villages = normalizeArray(location.villages);
    location.wards = normalizeArray(location.wards);

    // --- urban vs rural ---
    if (location.area_type === "UR") {
        location.local_body_id = normalizeObjectId(location.local_body_id);
        location.local_body_code = normalizeString(location.local_body_code);
        location.local_body_name = normalizeString(location.local_body_name);
        location.local_body_type_code = normalizeString(location.local_body_type_code);
        location.local_body_type_name = normalizeString(location.local_body_type_name);

        // irrelevant in UR → null/empty
        location.block_id = "";
        location.panchayat_id = "";
        location.block_code = "";
        location.block_name = "";
        location.panchayat_code = "";
        location.panchayat_name = "";
    }

    if (location.area_type === "RU") {
        location.block_id = normalizeObjectId(location.block_id);
        location.panchayat_id = normalizeObjectId(location.panchayat_id);
        location.block_code = normalizeString(location.block_code);
        location.block_name = normalizeString(location.block_name);
        location.panchayat_code = normalizeString(location.panchayat_code);
        location.panchayat_name = normalizeString(location.panchayat_name);

        // irrelevant in RU → null/empty
        location.local_body_id = "";
        location.local_body_code = "";
        location.local_body_name = "";
        location.local_body_type_code = "";
        location.local_body_type_name = "";
    }

    return location;
}
