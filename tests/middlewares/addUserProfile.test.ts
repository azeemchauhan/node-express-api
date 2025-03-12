import { addUserProfile } from '@middlewares/addUserProfile';
import { Request, Response, NextFunction } from 'express';
import cacheClient from '@config/cache';
import { Profile } from '@models/index';


jest.mock('@models/index');
jest.mock('@config/cache');

describe("AddUserProfile Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction = jest.fn() as NextFunction;

  beforeEach(() => { jest.clearAllMocks(); });


  test("should call next() when profile_id is in header and also exists in database", async() => {
    let userProfile = {id: 1, type: 'client'};
    mockRequest = { headers: { profile_id: '1' }, context: {}, get: jest.fn() };
    mockResponse = { status: jest.fn().mockReturnThis(), send: jest.fn().mockReturnThis() };
   
    (cacheClient.get as jest.Mock).mockResolvedValueOnce(null);
    (Profile.findOne as jest.Mock).mockResolvedValueOnce(userProfile);
    (cacheClient.set as jest.Mock).mockResolvedValueOnce(true);
    (mockRequest.get as jest.Mock).mockResolvedValueOnce([]);

    await addUserProfile(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(cacheClient.get).toHaveBeenCalled();
    expect(Profile.findOne).toHaveBeenCalled();
    expect(cacheClient.set).toHaveBeenCalled();
    expect(mockRequest.context?.user).toEqual(userProfile);
    expect(nextFunction).toHaveBeenCalled();
  });

  test("should't call next() when profile_id is not exist header, return 401 json", async() => {
    mockRequest = { headers: {  }, context: {}, get: jest.fn() };
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };

    (cacheClient.get as jest.Mock).mockResolvedValueOnce(null);

    await addUserProfile(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(cacheClient.get).toHaveBeenCalledTimes(0);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Authorization Failed." });
    expect(nextFunction).toHaveBeenCalledTimes(0);
  });

  test("should't call next() when profile_id is exist in header but not in the DB, return error json", async() => {
    mockRequest = { headers: {  }, context: {}, get: jest.fn() };
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };

    (mockRequest.get as jest.Mock).mockResolvedValueOnce(1);
    (cacheClient.get as jest.Mock).mockResolvedValueOnce(null);
    (Profile.findOne as jest.Mock).mockResolvedValueOnce(null);

    await addUserProfile(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(cacheClient.get).toHaveBeenCalledTimes(1);
    expect(cacheClient.set).toHaveBeenCalledTimes(0);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Authorization Failed." });
    expect(nextFunction).toHaveBeenCalledTimes(0);
  });
});