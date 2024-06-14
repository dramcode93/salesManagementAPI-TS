import express from "express";
import Joi from "joi";

const joiValidatorMiddleware = (schema: Joi.ObjectSchema): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const { error } = schema.validate(req, { abortEarly: true, context: req, stripUnknown: true });
        if (error) { return res.status(400).json({ errors: error.details }); }
        next();
    };
};

export default joiValidatorMiddleware;