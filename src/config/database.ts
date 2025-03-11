/**
 * Setting the Database configuration for Sequelize. 
 */

import { Sequelize } from 'sequelize';

/**
 * Create a Sequelize instance.
 */
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './database.sqlite3' });

export default sequelize