import { sendError } from '@/utils/response';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from "zod";


/**
 * Middleware to validate the request body against a Zod schema.
 *
 * @param {ZodSchema} schema - The Zod schema to validate the request body against.
 * @returns {RequestHandler} - Express middleware that parses and validates req.body.
 *
 * If validation passes, the parsed data replaces req.body and the request continues.
 * If validation fails, responds with HTTP 400 and the Zod validation errors.
 */

function validate(schema: ZodSchema<any>): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error: any) {
            sendError(res, 'Validation error', 400, error?.errors);
        }
    }
}

export default validate;