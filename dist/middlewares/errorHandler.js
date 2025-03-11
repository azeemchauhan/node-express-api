"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = require("@utils/appError");
const logger_1 = __importDefault(require("@utils/logger"));
/**
 * Error Handler Middleware
 */
const errorHandler = (err, request, response, next) => {
    logger_1.default.error(err.stack);
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation Error"; // Get proper message from error
    }
    else if (err.name === "ECONNREFUSED") {
        statusCode = 503; // Service Unavailable
        message = 'Database connection failed';
    }
    else if (err instanceof appError_1.AppError) {
        statusCode = err.statusCode;
        message = process.env.NODE_ENV === "production" ? "Something went wrong" : err.message;
    }
    response.status(statusCode).json({
        error: {
            code: statusCode,
            message: message
        }
    });
};
exports.default = errorHandler;
