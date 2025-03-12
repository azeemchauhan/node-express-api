import { NextFunction, Request, Response } from "express";
import { AppError } from "@utils/appError";
import logger from "@utils/logger";

/**
 * Error Handler Middleware
 */
const errorHandler = (err: AppError, request: Request, response: Response, next: NextFunction) => {
  logger.error(err.stack);
  let statusCode = err.statusCode || 500;
  let message = err.message;

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error"; // Get proper message from error
  } else if (err.name === "ECONNREFUSED") {
    statusCode = 503; // Service Unavailable
    message = 'Database connection failed';
  } else {
    statusCode = err.statusCode;
    message = process.env.NODE_ENV === "production" ? "Something went wrong" : err.message;
  }

  response.status(statusCode).json({
    error: {
      code: statusCode,
      message: message
    }
  })

  next();
};

export default errorHandler;