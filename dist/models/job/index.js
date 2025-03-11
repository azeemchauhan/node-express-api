"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importDefault(require("@config/database"));
const Job = database_1.default.define('Job', {
    description: {
        type: sequelize_1.default.TEXT,
        allowNull: false
    },
    price: {
        type: sequelize_1.default.DECIMAL(12, 2),
        allowNull: false
    },
    paid: {
        type: sequelize_1.default.BOOLEAN,
        defaultValue: false
    },
    paymentDate: {
        type: sequelize_1.default.DATE
    }
});
exports.default = Job;
