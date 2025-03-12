import { AppError } from "@utils/appError";

describe('AppError', () => {
  it('should create an AppError instance with correct properties', () => {
    const statusCode = 404;
    const message = 'Resource not found';
    const error = new AppError(statusCode, message);

    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(statusCode);
    expect(error.message).toBe(message);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
    expect(error.stack).toBeDefined(); 
  });

  it('should create an AppError instance with correct properties for non 404 status', () => {
    const statusCode = 500;
    const message = 'Resource not found';
    const error = new AppError(statusCode, message);

    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe(message);
    expect(error.status).toBe('error'); 
  });
});