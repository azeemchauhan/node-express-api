
/**
 * All the Routes related to Payments
 */
import express, { NextFunction, Request, Response } from 'express';
import { AppError } from '@utils/appError';
import logger from '@utils/logger';
import { numberValidatorParam } from '@utils/validations';
import { depositPayment } from '@data/paymentQueries';

const router = express.Router({ mergeParams: true });
/**
  * Deposit money into a client's balance. 
  * A client cannot deposit more than 25% of the total of jobs to pay at the time of deposit.
*/
router.post('/deposit/:amount', numberValidatorParam('amount'), async (request: Request, response: Response, next: NextFunction) => {
  const userProfile = request.context.user;
  const depositAmount = parseFloat(request.params.amount);
  const userType = userProfile.type == 'client' ? 'Client' : 'Contractor';

  if (userType === 'Contractor') throw new AppError(401, "Unauthorized");

  try {
    await depositPayment(userProfile.id, depositAmount);
    
    response
    .status(200)
    .json({ message: `Payment of ${depositAmount} is successfull to Debited from Client ${userProfile.id}` })
  } catch (err) {
    logger.error(err)
    if (err instanceof AppError) {
      next(err)
    } else {
      next(new AppError(500, `Payment of ${depositAmount} was unsuccessfull.`));
    };
  }
});


export default router;