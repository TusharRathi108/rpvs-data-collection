//* package imports
import { ZodError } from "zod";
import { CookieOptions, Response } from "express";
import { mongo, Error as MongooseError } from 'mongoose';

//* file imports
import { HttpError } from "@/utils/http-error";

export type StatusType = true | false

export interface ISuccessOptions<T> {
    response: Response;
    records?: T;
    message: string;
    httpCode?: number;
    status?: boolean;
    meta?: Record<string, any>;
    notFoundIfNull?: boolean;
    cookies?: {
        name: string;
        value: string;
        options?: CookieOptions;
    }[];
    headers?: Record<string, string>;
}

export const successHandler = <T = any>({
    response,
    records,
    message,
    httpCode = 200,
    status,
    meta,
    notFoundIfNull,
    cookies,
    headers,
}: ISuccessOptions<T>) => {
    if ((records === null || records === undefined) && notFoundIfNull) {
        return response.status(404).json({
            status: false,
            httpCode: 404,
            message: "Resource not found",
        });
    }

    if (Array.isArray(cookies)) {
        for (const { name, value, options } of cookies) {
            if (options) {
                response.cookie(name, value, options);
            } else {
                response.cookie(name, value);
            }
        }
    }

    if (headers && typeof headers === "object") {
        for (const [key, value] of Object.entries(headers)) {
            response.setHeader(key, value);
        }
    }

    const payload: Record<string, any> = {
        httpCode,
        message,
        status,
    };

    // if (Array.isArray(records)) {
    //     payload.records = records;
    // } else if (records !== undefined) {
    //     payload.record = records;
    // }

    if (records !== undefined) {
        payload.records = records;
    }

    if (meta && typeof meta === "object") {
        payload.meta = meta;
    }

    return response.status(httpCode).json(payload);
};

export function handleError(error: unknown, response: Response) {
    // 1. Handle Zod validation errors
    if (error instanceof ZodError) {
        const messages = error.issues.map(issue => {
            const key = issue.path.filter(p => typeof p === "string").join('.') || '<root>';
            return `${key}: ${issue.message}`;
        });

        return response.status(400).json({
            status: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: messages.join('; '),
                // details: error.issues,
            },
        });
    }

    // 2. Handle Mongoose/MongoDB Errors
    if (error instanceof MongooseError.ValidationError) {
        return response.status(400).json({
            status: false,
            error: {
                code: 'MONGOOSE_VALIDATION_ERROR',
                message: Object.values(error.errors).map(e => e.message).join('; '),
            },
        });
    }

    if (error instanceof MongooseError.CastError) {
        return response.status(400).json({
            status: false,
            error: {
                code: 'MONGOOSE_CAST_ERROR',
                message: `Invalid value for ${error.path}: ${error.value}`,
            },
        });
    }

    // MongoServerError — like duplicate key
    if (error instanceof mongo.MongoServerError && error.code === 11000) {
        const fields = Object.keys(error.keyValue || {});
        return response.status(400).json({
            status: false,
            error: {
                code: 'DUPLICATE_KEY',
                message: `Duplicate value for: ${fields.join(', ')}`,
            },
        });
    }

    // 3. Custom HttpError
    if (error instanceof HttpError) {
        const { status, code, message } = error;
        const safeMessage = status >= 500 ? 'Internal server error' : message;

        return response.status(status).json({
            status: false,
            error: {
                status,
                code,
                message: safeMessage,
            },
        });
    }

    // 4. Unknown/Unhandled Error → 500
    return response.status(500).json({
        status: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal server error',
        },
    });
}
