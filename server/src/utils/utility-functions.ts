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

/**
 * Generate financial year in either full ("2025-2026") or short ("25-26") format.
 * @param format "full" (default) | "short"
 */
export function calculateFinancialYear(format: "full" | "short" = "full"): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();

    const startYear = month < 3 ? year - 1 : year;
    const endYear = startYear + 1;

    if (format === "short") {
        return `${startYear.toString().slice(-2)}-${endYear.toString().slice(-2)}`;
    }

    return `${startYear}-${endYear}`;
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
