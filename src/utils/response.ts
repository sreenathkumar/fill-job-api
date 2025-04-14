import { Response } from "express";
import { ApiResponse } from "./types";

//Generalized "Success" response to make response consitent.
function sendSuccess<T>(
    res: Response,
    data: T,
    message: 'success',
    code: 200
): Response<ApiResponse<T>> {
    return res.status(code).json({
        status: true,
        message,
        data
    })
}

//Generalized "Error" response to make response consitent.
function sendError(
    res: Response,
    message: 'Something went wrong.',
    code: 500,
    errors: string[],
): Response<ApiResponse<null>> {
    return res.status(code).json({
        status: false,
        message,
        errors
    })
}