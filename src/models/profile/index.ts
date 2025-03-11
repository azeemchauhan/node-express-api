import Sequelize, { Model, ModelStatic } from 'sequelize';
import db from '@config/database';


/**
 * Profile Model: Two Types of Profile: 'client' and 'contractor'
 */


// Define your model
export interface ProfileModel extends Model {
  id: number;
  firstName: string;
  lastName: string;
  profession: string;
  balance: number;
  type: 'client' | 'contractor';
}

export type ProfileStatic = ModelStatic<ProfileModel>;

const Profile = db.define('Profile', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  profession: {
    type: Sequelize.STRING,
    allowNull: false
  },
  balance: {
    type: Sequelize.DECIMAL(12, 2)
  },
  type: {
    type: Sequelize.ENUM('client', 'contractor')
  }
}) as ProfileStatic;

export default Profile;
