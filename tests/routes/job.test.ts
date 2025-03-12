import request from 'supertest';
import express, { Express, NextFunction, Request, Response } from 'express';
import expressContext from 'express-request-context';
import { getAllUnpaidJobs, getJobById, updateClientBalance } from '@controllers/index';
import jobRouter from '@routes/job';
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

    (getAllUnpaidJobs as jest.Mock).mockClear();
    (getJobById as jest.Mock).mockClear();
    (updateClientBalance as jest.Mock).mockClear();
    (errorHandler as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /jobs/unpaid', () => {
    it('should return active contracts for a user', async () => {
      const mockUnpaidJobs = [{ id: 123, price: 49.99 }]
      app.use('/jobs', addClientProfile, jobRouter);

      (getAllUnpaidJobs as jest.Mock).mockResolvedValue(mockUnpaidJobs);

      const response = await request(app).get('/jobs/unpaid');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUnpaidJobs);
      expect(getAllUnpaidJobs).toHaveBeenCalledWith(1, 'Client');
    });

    it('should handle contractor user type', async () => {
      const mockUnpaidJobs = [{ id: 124, price: 49.99 }]
      app.use('/jobs', addContractorProfile, jobRouter);
      (getAllUnpaidJobs as jest.Mock).mockResolvedValue(mockUnpaidJobs);

      const response = await request(app).get('/jobs/unpaid');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUnpaidJobs);
      expect(getAllUnpaidJobs).toHaveBeenCalledWith(1, 'Contractor');
    });
  });

  describe('POST /jobs/:job_id/pay', () => {
    it('should make payment for the given job', async () => {
      const mockJob = { id: 124, price: 49.99, contractorId: 10 }
      app.use('/jobs', addClientProfile, jobRouter);

      (getJobById as jest.Mock).mockResolvedValue(mockJob);
      (updateClientBalance as jest.Mock).mockResolvedValue([]);

      const response = await request(app).post('/jobs/12/pay');

      expect(response.status).toBe(200);
      const message = { message: `Payment of ${mockJob.price} is successfull to Contractor ${mockJob.contractorId}` }
      expect(response.body).toEqual(message);
      expect(getJobById).toHaveBeenCalledWith(12);
      expect(updateClientBalance).toHaveBeenCalledWith(1, mockJob.contractorId, mockJob.price);
    });
  });
});