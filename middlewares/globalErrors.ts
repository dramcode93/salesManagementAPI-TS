import express from "express";

interface customError extends Error {
    statusCode?: number;
    status?: string;
};

const globalErrors = (err: customError, req: express.Request, res: express.Response, next: express.NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Error";
    if (process.env.NODE_ENV === "development") {
        res.status(err.statusCode).json({
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    };
};

export default globalErrors;