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
exports.getAllUnpaidJobs = exports.getJobById = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importDefault(require("@config/database"));
const index_1 = require("@models/index");
const cache_1 = __importDefault(require("@config/cache"));
const getJobById = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheKey = `${jobId}`;
    let jobCached = cache_1.default.get(cacheKey);
    if (jobCached)
        return jobCached;
    const result = yield index_1.Job.findOne({
        include: [
            {
                model: index_1.Contract,
                attributes: [],
                include: [{ model: index_1.Profile, as: 'Contractor', attributes: [] }]
            },
        ],
        attributes: [
            'id',
            'price',
            [database_1.default.col('Contract.Contractor.id'), 'contratorId'],
        ],
        where: { id: jobId },
        raw: true
    });
    cache_1.default.set(cacheKey, result, 2000);
    return result;
});
exports.getJobById = getJobById;
const getAllUnpaidJobs = (userId, userType) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheKey = `${userId}-${userType}`;
    let unpaidJobsCached = cache_1.default.get(cacheKey);
    if (unpaidJobsCached)
        return unpaidJobsCached;
    const unpaidJobs = yield index_1.Job.findAll({
        include: [
            {
                model: index_1.Contract,
                attributes: [],
                where: { status: { [sequelize_1.default.Op.ne]: 'terminated' } },
                include: [
                    {
                        model: index_1.Profile,
                        as: userType,
                        attributes: [],
                        where: { id: userId }
                    }
                ]
            }
        ],
        where: { paid: { [sequelize_1.default.Op.not]: true } },
        raw: true
    });
    return unpaidJobs;
});
exports.getAllUnpaidJobs = getAllUnpaidJobs;
