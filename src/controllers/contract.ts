
import Sequelize from 'sequelize';
import { Contract, Profile } from '@models/index';
import cacheClient from '@config/cache';

type ContractAttribute = {
  id: number;
  staus: string;
  terms: string;
  clientId: number;
  ContractorId: number;
}

const getActiveContracts = async (userId: number, userType: 'Client' | 'Contractor'): Promise<ContractAttribute[]> => {
  const cacheKey = `${userId}-${userType}`;
  let getActiveContracts: unknown = cacheClient.get(cacheKey);
  if (getActiveContracts) return getActiveContracts as ContractAttribute[];

  const contracts = await Contract.findAll({
    include: [
      {
        model: Profile,
        as: userType,
        attributes: [],
        where: { id: userId }
      }
    ],
    where: { status: { [Sequelize.Op.ne]: 'terminated' } },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    raw: true
  }) as unknown;

   cacheClient.set(cacheKey, contracts, 2000);

  return contracts as ContractAttribute[];
}


const getContract = async (userId: number, contractId: number, userType: 'Client' | 'Contractor'): Promise<ContractAttribute> => {
  const cacheKey = `${userId}-${contractId}-${userType}`;
  let contractCached: unknown = cacheClient.get(cacheKey);
  if (contractCached) return contractCached as ContractAttribute;

  const result = await Contract.findOne({
    include: [
      {
        model: Profile,
        as: userType,
        attributes: [],
        where: { id: userId }
      }
    ],
    where: { id: contractId },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    raw: true
  }) as unknown;

  cacheClient.set(cacheKey, result, 2000);

  return result as ContractAttribute
}

export { getActiveContracts, getContract }