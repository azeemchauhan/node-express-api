
import Sequelize, { Model, ModelAttributes, Optional } from 'sequelize';
import db from '@config/database';
import { Contract, Profile, Job } from '@models/index';
import { AppError } from '@utils/appError';
import cacheClient from '@config/cache';

type ProfileAttribute = {
  id: number;
  balace: number;
};

const getProfileById = async (userId: number): Promise<ProfileAttribute> => {
  const cacheKey = `${userId}`;
  let profileCached: unknown = cacheClient.get(cacheKey);
  if (profileCached) return profileCached as ProfileAttribute;

  const result = await Profile.findOne({
    attributes: ['balance'],
    where: { id: userId, type: 'client' },
    raw: true
  }) as unknown;

  cacheClient.set(cacheKey, result, 2000);

  return result as ProfileAttribute
};

const updateClientBalance = async (clientId: number, contractorId: number, payment: number) => {
  await db.transaction(async t => {
    // Step: 1 Check Balance
    // Get Latest balace of Client
    const clientProfile = await Profile.findOne({
      attributes: ['balance'],
      where: { id: clientId, type: 'client' },
      raw: true,
      transaction: t
    });
    const clientBalance = clientProfile?.balance;

    if (!clientBalance) throw new Error(`Not able to fetch Client balance ClientId: ${clientId}`);
    if (clientBalance < payment) throw new AppError(501, `Insufficient Fund ClientId: ${clientId}`);

    // Step: 2 Debit from the Client
    await Profile.update(
      { balance: Sequelize.literal(`balance - ${payment}`) },
      {
        where: { id: clientId, type: 'client' },
        transaction: t
      },
    );

    // Step: 3 Credit to Contractor
    await Profile.update(
      { balance: Sequelize.literal(`balance + ${payment}`) },
      {
        where: { id: contractorId, type: 'contractor' },
        transaction: t
      }
    );
  });

};




export { getProfileById, updateClientBalance }