import { getBestClients, getBestProfession } from '@data/adminQueries'
import { getActiveContracts } from '@data/contractQueries';
import { getProfileById } from '@data/profileQueries';
import { getJobById, getAllUnpaidJobs } from '@data/jobQueries';
import { depositPayment } from '@data/paymentQueries';



export {
  getBestClients,
  getBestProfession,
  getActiveContracts,
  getJobById,
  getProfileById,
  getAllUnpaidJobs,
  depositPayment
}