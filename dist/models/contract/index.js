"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importDefault(require("@config/database"));
const Contract = database_1.default.define('Contract', {
    terms: {
        type: sequelize_1.default.TEXT,
        allowNull: false
    },
    status: {
        type: sequelize_1.default.ENUM('new', 'in_progress', 'terminated')
    }
});
exports.default = Contract;
