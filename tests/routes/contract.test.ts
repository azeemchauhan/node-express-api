import request from 'supertest';
import express, { Express, NextFunction, Request, Response } from 'express';
import expressContext from 'express-request-context';
import { getActiveContracts, getContract } from '@controllers/index';
import contractRouter from '@routes/contract';
import errorHandler from '@middlewares/errorHandler';

jest.mock('@middlewares/errorHandler');
jest.mock('@controllers/index');

const addClientProfile = (req: Request, response: Response, next: NextFunction) => {
  // Adding Current User Profile to Request context
  req.context.user = { id: 1, type: 'client' };
  next()
};

const addContractorProfile = (req: Request, response: Response, next: NextFunction) => {
  // Adding Current User Profile to Request context
  req.context.user = { id: 1, type: 'contractor' };
  next()
};

describe('Contract Router', () => {
  let app: Express;
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(expressContext());

    (getActiveContracts as jest.Mock).mockClear();
    (getContract as jest.Mock).mockClear();
    (errorHandler as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /contracts', () => {
    it('should return active contracts for a user', async () => {
      app.use('/contracts', addClientProfile, contractRouter);
      const mockContracts = [{ id: 101, terms: 'Contract 1' }];

      (getActiveContracts as jest.Mock).mockResolvedValue(mockContracts);

      const response = await request(app).get('/contracts');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockContracts);
      expect(getActiveContracts).toHaveBeenCalledWith(1, 'Client');
    });

    it('should handle contractor user type', async () => {
      const mockContracts = [{ id: 201, terms: 'Contract 2' }];
      app.use('/contracts', addContractorProfile, contractRouter);
      (getActiveContracts as jest.Mock).mockResolvedValue(mockContracts);

      const response = await request(app).get('/contracts')

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockContracts);
      expect(getActiveContracts).toHaveBeenCalledWith(1, 'Contractor');
    });
  });

  describe('GET /contracts/:id', () => {
    it('should return a contract if it belongs to the client', async () => {
      const mockContract = { id: 101, terms: 'Contract 1' };
      app.use('/contracts', addClientProfile, contractRouter);

      (getContract as jest.Mock).mockResolvedValue(mockContract);

      const response = await request(app).get('/contracts/101')

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockContract);
      expect(getContract).toHaveBeenCalledWith(1, 101, 'Client');
    });

    it('should handle contractor user type', async () => {
      const mockContract = { id: 201, terms: 'Contract 2' };
      app.use('/contracts', addContractorProfile, contractRouter);
      (getContract as jest.Mock).mockResolvedValue(mockContract);

      const response = await request(app).get('/contracts/201')

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockContract);
      expect(getContract).toHaveBeenCalledWith(1, 201, 'Contractor');
    });
  });
});