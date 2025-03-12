/**
 * All the Routes related to Contracts
 */
import express, { NextFunction, Request, Response } from 'express';
import { AppError } from '@utils/appError';
import { getActiveContracts, getContract } from '@controllers/index';
import { numberValidatorParam } from '@utils/validations';

let router = express.Router({ mergeParams: true });

/**
 * Returns a list of contracts belonging to a user (client or contractor).
 * The list should only contain non-terminated contracts.
 */
router.get('/', async (request: Request, response: Response) => {
  const userProfile = request.context.user;
  const userType = userProfile.type == 'client' ? 'Client' : 'Contractor';

  const contracts = await getActiveContracts(userProfile.id, userType);

  response.json(contracts);
});

/**
* Return the contract only if it belongs to the profile making the request.
*/
router.get('/:id', numberValidatorParam('id'), async (request: Request, response: Response, next: NextFunction) => {
  const userProfile = request.context.user;
  const userType = userProfile.type == 'client' ? 'Client' : 'Contractor';
  const contractId = parseInt(request.params.id);

  const contract = await getContract(userProfile.id, contractId, userType)

  if (contract) response.json(contract);

  next(new AppError(404, `contract is not exist for ${userType}: ${userProfile.id}`));
});

export default router;