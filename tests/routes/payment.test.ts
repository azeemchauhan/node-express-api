import request from 'supertest';
import express, { Express, NextFunction, Request, Response } from 'express';
import expressContext from 'express-request-context';
import { depositPayment } from '@controllers/index';
import paymentRouter from '@routes/payment';
import errorHandler from '@middlewares/errorHandler';
import { AppError } from '@utils/appError';

jest.mock('@middlewares/errorHandler');
jest.mock('@controllers/index');
const spy = jest.spyOn(global.console, "error").mockImplementation();

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

    (depositPayment as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /balance/deposit/:amount', () => {
    it('should deposit balance from the client', async () => {
      app.use('/balances', addClientProfile, paymentRouter);
      app.use(errorHandler);

      (depositPayment as jest.Mock).mockResolvedValue([]);

      const response = await request(app).post('/balances/deposit/101.1');

      expect(response.status).toBe(200);
      const message = { message: `Payment of 101.1 is successfull to Debited from Client 1` }
      expect(response.body).toEqual(message);
      expect(depositPayment).toHaveBeenCalledWith(1, 101.1);
    });

    it('should return error when deposit with insufficient balance is tried', async () => {
      app.use('/balances', addClientProfile, paymentRouter);

      (depositPayment as jest.Mock).mockImplementation(() => {throw new Error ();});

      let response = await request(app).post('/balances/deposit/100').timeout(1000)

      expect(response.status).toBe(500);
    });
  });
});