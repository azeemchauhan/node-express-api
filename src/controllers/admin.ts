
import Sequelize, { Model, ModelAttributes, Optional } from 'sequelize';
import db from '@config/database';
import { Contract, Profile, Job } from '@models/index';
import cacheClient from '@config/cache';

type ExpectedDateType = Date | null
type BestProfession = { name: string, totalEarning: number };

const getBestProfession = async (startDate: ExpectedDateType, endDate: ExpectedDateType, limit = 1): Promise<BestProfession | null> => {
  const cacheKey = `${startDate}-${endDate}-${limit}`;
  let bestProfessionResult: unknown = cacheClient.get(cacheKey);
  if (bestProfessionResult) return bestProfessionResult as BestProfession;

  const result = await Contract.findOne({
    // Join with Profile where type: 'client'
    include: [
      { model: Profile, as: 'Contractor', attributes: [] },
      {
        model: Job,
        attributes: [],
        where: {
          paid: true,
          [Sequelize.Op.and]: [
            { paymentDate: { [Sequelize.Op.gte]: startDate } },
            { paymentDate: { [Sequelize.Op.lte]: endDate } }
          ]
        }
      }
    ],
    attributes: [
      [db.col('Contractor.profession'), 'name'],
      [db.fn('SUM', db.col('Jobs.price')), 'totalEarning']
    ],
    group: 'Contractor.profession',
    order: [[db.literal('totalEarning'), "DESC"]],
    limit: limit,
    subQuery: false,
    raw: true
  }) as unknown;

  cacheClient.set(cacheKey, result, 2000);

  return result as BestProfession | null;
}

type BestClient = {
  id: number;
  firstName: string;
  lastName: string;
  paid: number;
};

const getBestClients = async (startDate: Date | null, endDate: Date | null, limit: number): Promise<BestClient[]> => {
  const cacheKey = `${startDate}-${endDate}-${limit}`;
  let bestClientsResult: unknown = cacheClient.get(cacheKey);

  if (bestClientsResult) return bestClientsResult as BestClient[];

  const clients = await Contract.findAll({
    include: [
      { model: Profile, as: 'Client', attributes: [] },
      {
        model: Job,
        attributes: [],
        where: {
          paid: true,
          [Sequelize.Op.and]: [
            { paymentDate: { [Sequelize.Op.gte]: startDate } },
            { paymentDate: { [Sequelize.Op.lte]: endDate } }
          ]
        }
      }
    ],
    attributes: [
      'id',
      [db.literal('Client.firstName'), 'firstName'],
      [db.literal('Client.lastName'), 'lastName'],
      [db.fn('SUM', db.col('Jobs.price')), 'paid']
    ],
    group: 'ClientId',
    order: [[db.literal('paid'), "DESC"]],
    limit: limit,
    subQuery: false,
    raw: true
  }) as unknown;

  cacheClient.set(cacheKey, clients, 2000);

  return clients as BestClient[];
};


export { getBestClients, getBestProfession }