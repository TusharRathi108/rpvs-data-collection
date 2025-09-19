//* file imports
import { HttpError } from "@/utils/http-error"

export enum ExceptionType {
    BadRequest = 'BadRequestException',
    Unauthorized = 'UnauthorizedException',
    Forbidden = 'ForbiddenException',
    NotFound = 'NotFoundException',
    Conflict = 'ConflictException',
    Internal = 'InternalServerErrorException',
}

const exceptionMetadata: Record<
    ExceptionType,
    { status: number; code: string; defaultMessage: string }
> = {
    [ExceptionType.BadRequest]: {
        status: 400,
        code: 'BAD_REQUEST',
        defaultMessage: 'Bad request',
    },
    [ExceptionType.Unauthorized]: {
        status: 401,
        code: 'UNAUTHORIZED',
        defaultMessage: 'Authentication required',
    },
    [ExceptionType.Forbidden]: {
        status: 403,
        code: 'FORBIDDEN',
        defaultMessage: 'You do not have access to this resource',
    },
    [ExceptionType.NotFound]: {
        status: 404,
        code: 'NOT_FOUND',
        defaultMessage: 'Resource not found',
    },
    [ExceptionType.Conflict]: {
        status: 409,
        code: 'CONFLICT',
        defaultMessage: 'Conflict with current state',
    },
    [ExceptionType.Internal]: {
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
        defaultMessage: 'Internal server error',
    },
}

export function throwHttpException(
    type: ExceptionType,
    message?: string
): never {
    const { status, code, defaultMessage } = exceptionMetadata[type]
    throw new HttpError(status, code, message ?? defaultMessage)
}
