export class HttpError extends Error {
    public readonly status: number;
    public readonly code: string;

    constructor(status: number = 500, code: string, message: string) {
        super(message)
        this.status = status
        this.code = code

        Object.setPrototypeOf(this, HttpError.prototype)
    }
}

export function raiseHttpError(
    code: string,
    message: string,
    status?: number
): never {
    throw new HttpError(status, code, message);
}
