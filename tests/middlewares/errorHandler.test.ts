
import errorHandler from "@middlewares/errorHandler";
import { Request, Response, NextFunction } from "express";
import { AppError } from "@utils/appError";
import logger from "@utils/logger";

jest.mock('@utils/appError');
jest.mock('@utils/logger');

describe("Error Handler Middleware", () => {
  const originalEnv = process.env;

  let mockRequest:Partial<Request>;
  let mockResponse:Partial<Response>
  let nextFunction = jest.fn() as NextFunction;
  let mockErr = {statusCode: 400, name: "ValidationError", message: "Internal Server Error"}

  beforeEach(() => { 
    jest.clearAllMocks();
  });

  afterAll(() => {  process.env = originalEnv; });

  test("should call next after setting the proper 400 error response ", () => {
    mockRequest = { headers: { } };
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };;
    
    errorHandler(mockErr as AppError, mockRequest as Request, mockResponse as Response, nextFunction);

    const expectedJson = {error: {code: mockErr.statusCode, message: "Validation Error"}};
    expect(logger.error).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(mockErr.statusCode);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedJson);    
    expect(nextFunction).toHaveBeenCalled();
  });

  test("should call next after setting the proper 503 error response ", () => {
    mockRequest = { headers: { } };
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };;
    mockErr.statusCode = 503;
    mockErr.name = "ECONNREFUSED";

    errorHandler(mockErr as AppError, mockRequest as Request, mockResponse as Response, nextFunction);

    const expectedJson = {error: {code: mockErr.statusCode, message: "Database connection failed"}};
    expect(logger.error).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(mockErr.statusCode);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedJson);    
    expect(nextFunction).toHaveBeenCalled();
  });

  test("should call next after setting default error response ", () => {
    mockRequest = { headers: { } };
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };;
    mockErr.statusCode = 500;
    mockErr.name = "THISISNOTEXIST";

    errorHandler(mockErr as AppError, mockRequest as Request, mockResponse as Response, nextFunction);

    const expectedJson = {error: {code: mockErr.statusCode, message: "Internal Server Error"}};
    expect(logger.error).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(mockErr.statusCode);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedJson);    
    expect(nextFunction).toHaveBeenCalled();
  });

  test("should call next after setting default error response in production mode", () => {
    mockRequest = { headers: { } };
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };;
    mockErr.statusCode = 500;
    mockErr.name = "THISISNOTEXIST";
    process.env.NODE_ENV = "production";

    errorHandler(mockErr as AppError, mockRequest as Request, mockResponse as Response, nextFunction);

    const expectedJson = {error: {code: mockErr.statusCode, message: "Something went wrong"}};
    expect(logger.error).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(mockErr.statusCode);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedJson);    
    expect(mockResponse.json).toHaveBeenCalledTimes(1);    
    expect(nextFunction).toHaveBeenCalled();
  });
});