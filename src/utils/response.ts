import { Response } from "express";
import { ApiResponse } from "./types";

// Generalized "Success" response
function sendSuccess<T>(
    res: Response,
    data: T,
    message: string = "Success",
    code: number = 200
): Response<ApiResponse<T>> {
    return res.status(code).json({
        status: true,
        message,
        data
    });
}

// Generalized "Error" response
function sendError(
    res: Response,
    message: string = 'Something went wrong',
    code: number = 500,
    errors: string[] = []
): Response<ApiResponse<null>> {
    return res.status(code).json({
        status: false,
        message,
        errors
    });
}

export {
    sendError,
    sendSuccess
};
