
import Sequelize, { Model, ModelStatic } from 'sequelize';
import db from '@config/database';

// Define your model
export interface JobModel extends Model {
  id: number;
  description: string;
  price: number;
  paid: boolean;
  paymentDate: Date;
}

type JobStatic = ModelStatic<JobModel>;

const Job = db.define('Job', {
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  price: {
    type: Sequelize.DECIMAL(12, 2),
    allowNull: false
  },
  paid: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  paymentDate: {
    type: Sequelize.DATE
  }
}) as JobStatic;


export default Job;