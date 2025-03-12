
/**
 * Job Related Routes
 */

import express, { NextFunction, Request, Response } from 'express';

import { AppError } from '@utils/appError';
import logger from '@utils/logger';
import { numberValidatorParam } from '@utils/validations';
import { getAllUnpaidJobs, getJobById, updateClientBalance } from '@controllers/index';

const router = express.Router({ mergeParams: true });


/**
 * Get all unpaid jobs for a user (**_either_** a client or contractor),
 * but only for **_active contracts_**.
 */
router.get('/unpaid', async (request: Request, response: Response) => {
  const userProfile = request.context.user;
  const userType = userProfile.type == 'client' ? 'Client' : 'Contractor';
  
  const unpaidJobs = await getAllUnpaidJobs(userProfile.id, userType);

  response.json(unpaidJobs)
});

/**
 * Pay for a job. A client can only pay if their balance is greater than or equal to the amount due. 
 * The payment amount should be moved from the client's balance to the contractor's balance.
*/
router.post('/:job_id/pay', numberValidatorParam('job_id'), async (request: Request, response: Response, next: NextFunction) => {
  const userProfile = request.context.user;
  const jobId = parseInt(request.params.job_id);

  const userType = userProfile.type == 'client' ? 'Client' : 'Contractor';

  if (userType === 'Contractor') throw new AppError(401, "Unauthorized Users");
  
  const jobResult = await getJobById(jobId);
  const jobAmount = jobResult?.price;
  const contractorId = jobResult?.contractorId;

  try {
    if (!jobAmount) throw new AppError(400, `Job is not exists for Job ID: ${jobId}`)

    await updateClientBalance(userProfile.id, contractorId, jobAmount);
    response.status(200).json({ message: `Payment of ${jobAmount} is successfull to Contractor ${contractorId}` })
  } catch (err) {
    logger.error(err)
    if (err instanceof AppError) {
      next(err)
    } else {
      next(new AppError(500, `Payment of ${jobAmount} was unsuccessfull.`));
    };
  };
});


export default router;