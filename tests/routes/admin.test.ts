import request from 'supertest';
import express, { Express, NextFunction, Request, Response } from 'express';
import expressContext from 'express-request-context';
import { getBestProfession, getBestClients } from '@controllers/index';
import adminRouter from '@routes/admin';
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

    (getBestProfession as jest.Mock).mockClear();
    (getBestClients as jest.Mock).mockClear();
    (errorHandler as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /admin/best-profession', () => {
    it('should return best profession', async () => {
      const mockQueryParams = { start: '2020-10-10', end: '2022-10-10' };
      const mockBestProfession = { name: "Azeem", totalEarning: 100 };
      app.use('/admin', addClientProfile, adminRouter);

      (getBestProfession as jest.Mock).mockResolvedValue(mockBestProfession);

      const response = await request(app).get('/admin/best-profession').query(mockQueryParams);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ name: "Azeem" });
      expect(getBestProfession).toHaveBeenCalledWith(new Date(mockQueryParams.start), new Date(mockQueryParams.end), 1);
    });
  });

  describe('GET /admin/best-clients', () => {
    it('should return the best clients', async () => {
      const mockQueryParams = { start: '2020-10-10', end: '2022-10-10', limit: 2 };
      const mockBestClients = [{ id: 1, firstName: "Azeem", lastName: "Chauhan", paid: 123.45}];
      app.use('/admin', addClientProfile, adminRouter);

      (getBestClients as jest.Mock).mockResolvedValue(mockBestClients);

      const response = await request(app).get('/admin/best-clients').query(mockQueryParams);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{id: 1, fullName: "Azeem Chauhan", paid: 123.45}]);
      expect(getBestClients).toHaveBeenCalledWith(new Date(mockQueryParams.start), new Date(mockQueryParams.end), mockQueryParams.limit)
    });
  });
});