"use strict";
/**
 * Setting the Database configuration for Sequelize.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
/**
 * Create a Sequelize instance.
 */
const sequelize = new sequelize_1.Sequelize({ dialect: 'sqlite', storage: './database.sqlite3' });
exports.default = sequelize;
