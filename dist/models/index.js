"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = exports.Contract = exports.Profile = void 0;
const profile_1 = __importDefault(require("@models/profile"));
exports.Profile = profile_1.default;
const job_1 = __importDefault(require("@models/job"));
exports.Job = job_1.default;
const contract_1 = __importDefault(require("@models/contract"));
exports.Contract = contract_1.default;
profile_1.default.hasMany(contract_1.default, { as: 'Contractor', foreignKey: 'ContractorId' });
profile_1.default.hasMany(contract_1.default, { as: 'Client', foreignKey: 'ClientId' });
contract_1.default.belongsTo(profile_1.default, { as: 'Contractor' });
contract_1.default.belongsTo(profile_1.default, { as: 'Client' });
contract_1.default.hasMany(job_1.default);
job_1.default.belongsTo(contract_1.default);
