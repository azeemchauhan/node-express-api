"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContract = exports.getActiveContracts = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const index_1 = require("@models/index");
const cache_1 = __importDefault(require("@config/cache"));
const getActiveContracts = (userId, userType) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheKey = `${userId}-${userType}`;
    let getActiveContracts = cache_1.default.get(cacheKey);
    if (getActiveContracts)
        return getActiveContracts;
    const contracts = yield index_1.Contract.findAll({
        include: [
            {
                model: index_1.Profile,
                as: userType,
                attributes: [],
                where: { id: userId }
            }
        ],
        where: { status: { [sequelize_1.default.Op.ne]: 'terminated' } },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        raw: true
    });
    cache_1.default.set(cacheKey, contracts, 2000);
    return contracts;
});
exports.getActiveContracts = getActiveContracts;
const getContract = (userId, contractId, userType) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheKey = `${userId}-${contractId}-${userType}`;
    let contractCached = cache_1.default.get(cacheKey);
    if (contractCached)
        return contractCached;
    const result = yield index_1.Contract.findOne({
        include: [
            {
                model: index_1.Profile,
                as: userType,
                attributes: [],
                where: { id: userId }
            }
        ],
        where: { id: contractId },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        raw: true
    });
    cache_1.default.set(cacheKey, result, 2000);
    return result;
});
exports.getContract = getContract;
