
import Sequelize, { Model, ModelAttributes, Optional } from 'sequelize';
import db from '@config/database';
import { Contract, Profile, Job } from '@models/index';
import cacheClient from '@config/cache';

type JobAttributes = {
  id: number;
  price: number;
  contratorId: number;
};

const getJobById = async (jobId: number): Promise<JobAttributes> => {
  const cacheKey = `${jobId}`;
  let jobCached: unknown = cacheClient.get(cacheKey);
  if (jobCached) return jobCached as JobAttributes;

  const result = await Job.findOne({
    include: [
      {
        model: Contract,
        attributes: [],
        include: [{ model: Profile, as: 'Contractor', attributes: [] }]
      },
    ],
    attributes: [
      'id',
      'price',
      [db.col('Contract.Contractor.id'), 'contratorId'],
    ],
    where: { id: jobId },
    raw: true
  }) as unknown;

  cacheClient.set(cacheKey, result, 2000);

  return result as JobAttributes;
};


type UnpaidJobAttributes = {
  id: number;
  price: number;
  paid: boolean;
  description: string;
  paymentDate: string;
};

const getAllUnpaidJobs = async (userId: number, userType: 'Client' | 'Contractor'): Promise<UnpaidJobAttributes[]> => {
  const cacheKey = `${userId}-${userType}`;
  let unpaidJobsCached: unknown = cacheClient.get(cacheKey);
  if (unpaidJobsCached) return unpaidJobsCached as UnpaidJobAttributes[];

  const unpaidJobs = await Job.findAll({
    include: [
      {
        model: Contract,
        attributes: [],
        where: { status: { [Sequelize.Op.ne]: 'terminated' } },
        include: [
          {
            model: Profile,
            as: userType,
            attributes: [],
            where: { id: userId }
          }
        ]
      }
    ],
    where: { paid: { [Sequelize.Op.not]: true } },
    raw: true
  }) as unknown;

  return unpaidJobs as UnpaidJobAttributes[];
};



export { getJobById, getAllUnpaidJobs }