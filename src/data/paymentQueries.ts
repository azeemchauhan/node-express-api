
import Sequelize from 'sequelize';
import db from '@config/database';
import { Contract, Profile, Job } from '@models/index';
import { AppError } from '@utils/appError';

type ContractAggregationAttributes = {
  id: number;
  amount: string;
}

const depositPayment = async (clientId: number, payment: number) => {
  await db.transaction(async t => {
    // Step: 1: Get Latest balace of Client
    const clientProfile = await Profile.findOne({
      attributes: ['balance'],
      where: { id: clientId, type: 'client' },
      raw: true,
      transaction: t
    });

    // Step: 2: Get Latest due on Client
    const totalPendingPayment = await Contract.findOne({
      include: [{ model: Job, attributes: [] }],
      attributes: [[db.fn('SUM', db.col('Jobs.price')), 'amount']],
      group: 'clientId',
      where: { clientId: 1, status: { [Sequelize.Op.ne]: 'terminated' } },
      subQuery: false,
      raw: true,
      transaction: t
    }) as unknown as ContractAggregationAttributes;

    const balance = clientProfile?.balance;
    const pendingPayment = totalPendingPayment?.amount;

    if (!balance) throw new Error(`Not able to fetch Client balance ClientId: ${clientId}`);
    if (balance < payment) throw new AppError(501, `Insufficient Fund ClientId: ${clientId}`);

    // A client cannot deposit more than 25% of the total of jobs to pay at the time of deposit.
    const acceptablePayment = (25 * parseFloat(pendingPayment))/100;
    if(payment > acceptablePayment) throw new AppError(501, `The Client: ${clientId} can only deposit at most: ${acceptablePayment}`);

    // Step: 3 Move Amount from Client balance to Contrator's balance.
    await Profile.update(
      { balance: Sequelize.literal(`balance - ${acceptablePayment}`) },
      {
        where: { id: clientId, type: 'client' },
        transaction: t
      }
    );
  });

};




export { depositPayment }