import { Request, Response, NextFunction, RequestHandler } from 'express';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

const classValidatorMiddleware = (dtoClass: any): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {

        const data: any = {
            ...req.body,
            ...req.params,
            ...req.query,
        };

        const output: any = plainToClass(dtoClass, data);
        const errors: ValidationError[] = await validate(output);

        if (errors.length > 0) {
            const messages = errors.map((error) => { return Object.values(error.constraints || {}).join(', '); });
            return res.status(400).json({ errors: messages });
        };

        req.body = output.body || req.body;
        req.params = output.params || req.params;
        req.query = output.query || req.query;
        next();
    };
};

export default classValidatorMiddleware;