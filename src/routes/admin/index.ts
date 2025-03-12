/**
* Admin Routes 
*/
import express, { Request, Response } from 'express';

import { getBestProfession, getBestClients } from '@controllers/index';
import { convertToDate } from '@utils/guards';
import { dateValidatorQuery, numberValidatorQuery } from '@utils/validations';

const router = express.Router({ mergeParams: true });

const bestProfessionValidation = [dateValidatorQuery('start'), dateValidatorQuery('end')];
const bestClientValidation = [dateValidatorQuery('start'), dateValidatorQuery('end'), numberValidatorQuery('limit')];

/**
 * Returns the profession that earned the most money (sum of jobs paid) 
 * for any contractor who worked within the specified time range.
 */
router.get('/best-profession', bestProfessionValidation, async (request: Request, response: Response) => {
  const startDate = convertToDate(request.query.start);
  const endDate = convertToDate(request.query.end);
  const limit = 1;

  const result = await getBestProfession(startDate, endDate, limit);
  const bestProfession = result && { name: result.name };

  response.status(200).json(bestProfession);
});

/**
 * Returns the clients who paid the most for jobs within the specified time period. 
 * The `limit` query parameter should be applied, and the default limit is 2.
 */
router.get('/best-clients', bestClientValidation, async (request: Request, response: Response) => {
  const startDate = convertToDate(request.query.start);
  const endDate = convertToDate(request.query.end);
  const limit = (request.query.limits || 2) as number;

  const bestClientsResult = await getBestClients(startDate, endDate, limit);

  const bestClients = bestClientsResult.map((client => {
    return {
      id: client.id,
      fullName: `${client.firstName} ${client.lastName}`,
      paid: client.paid
    }
  }));

  response.status(200).json(bestClients);
});


export default router;