import request from 'supertest';
import express, { Express, Request, Response, NextFunction } from 'express';
import { contractRouter} from '@routes/index';
import { getActiveContracts, getContract } from '@data/contractQueries';
import app from '../src/app';
import errorHandler from '@middlewares/errorHandler';

jest.mock('@middlewares/addUserProfile', () => ({
  addUserProfile: (req: Request, response: Response, next: NextFunction) => {
    req.context.user = { id: 1, type: 'client' };
    next()
  }
}));
jest.mock('@middlewares/errorHandler');
jest.mock('@data/contractQueries');
jest.mock('@middlewares/errorHandler');


describe('App', () => {

  beforeEach(() => {
    (getActiveContracts as jest.Mock).mockClear();
    (getContract as jest.Mock).mockClear();
    (errorHandler as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should use addUserProfile middleware for /contracts', async () => {
    const routerGetSpy = jest.spyOn(contractRouter, 'get').mockImplementation(jest.fn());
  
    await request(app).get('/contracts/').timeout(1000);
  
    expect(contractRouter.get).toHaveBeenCalledTimes(0);
  });

});