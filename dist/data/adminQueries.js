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
exports.getBestProfession = exports.getBestClients = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importDefault(require("@config/database"));
const index_1 = require("@models/index");
const cache_1 = __importDefault(require("@config/cache"));
const getBestProfession = (startDate_1, endDate_1, ...args_1) => __awaiter(void 0, [startDate_1, endDate_1, ...args_1], void 0, function* (startDate, endDate, limit = 1) {
    const cacheKey = `${startDate}-${endDate}-${limit}`;
    let bestProfessionResult = cache_1.default.get(cacheKey);
    if (bestProfessionResult)
        return bestProfessionResult;
    const result = yield index_1.Contract.findOne({
        // Join with Profile where type: 'client'
        include: [
            { model: index_1.Profile, as: 'Contractor', attributes: [] },
            {
                model: index_1.Job,
                attributes: [],
                where: {
                    paid: true,
                    [sequelize_1.default.Op.and]: [
                        { paymentDate: { [sequelize_1.default.Op.gte]: startDate } },
                        { paymentDate: { [sequelize_1.default.Op.lte]: endDate } }
                    ]
                }
            }
        ],
        attributes: [
            [database_1.default.col('Contractor.profession'), 'name'],
            [database_1.default.fn('SUM', database_1.default.col('Jobs.price')), 'totalEarning']
        ],
        group: 'Contractor.profession',
        order: [[database_1.default.literal('totalEarning'), "DESC"]],
        limit: limit,
        subQuery: false,
        raw: true
    });
    cache_1.default.set(cacheKey, result, 2000);
    return result;
});
exports.getBestProfession = getBestProfession;
const getBestClients = (startDate, endDate, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheKey = `${startDate}-${endDate}-${limit}`;
    let bestClientsResult = cache_1.default.get(cacheKey);
    if (bestClientsResult)
        return bestClientsResult;
    const clients = yield index_1.Contract.findAll({
        include: [
            { model: index_1.Profile, as: 'Client', attributes: [] },
            {
                model: index_1.Job,
                attributes: [],
                where: {
                    paid: true,
                    [sequelize_1.default.Op.and]: [
                        { paymentDate: { [sequelize_1.default.Op.gte]: startDate } },
                        { paymentDate: { [sequelize_1.default.Op.lte]: endDate } }
                    ]
                }
            }
        ],
        attributes: [
            'id',
            [database_1.default.literal('Client.firstName'), 'firstName'],
            [database_1.default.literal('Client.lastName'), 'lastName'],
            [database_1.default.fn('SUM', database_1.default.col('Jobs.price')), 'paid']
        ],
        group: 'ClientId',
        order: [[database_1.default.literal('paid'), "DESC"]],
        limit: limit,
        subQuery: false,
        raw: true
    });
    cache_1.default.set(cacheKey, clients, 2000);
    return clients;
});
exports.getBestClients = getBestClients;
