"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importDefault(require("@config/database"));
const Profile = database_1.default.define('Profile', {
    firstName: {
        type: sequelize_1.default.STRING,
        allowNull: false
    },
    lastName: {
        type: sequelize_1.default.STRING,
        allowNull: false
    },
    profession: {
        type: sequelize_1.default.STRING,
        allowNull: false
    },
    balance: {
        type: sequelize_1.default.DECIMAL(12, 2)
    },
    type: {
        type: sequelize_1.default.ENUM('client', 'contractor')
    }
});
exports.default = Profile;
