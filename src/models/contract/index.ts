import Sequelize, { Model, ModelStatic } from 'sequelize';
import db from '@config/database';

// Define your model
export interface ContractModel extends Model {
  id: number;
  terms: string;
  status: 'new' | 'in_progress' | 'terminated';
}

type ContractStatic = ModelStatic<ContractModel>;

const Contract = db.define('Contract', {
  terms: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('new', 'in_progress', 'terminated')
  }
}) as ContractStatic;


export default Contract;