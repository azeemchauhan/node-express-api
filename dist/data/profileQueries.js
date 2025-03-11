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
exports.updateClientBalance = exports.getProfileById = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importDefault(require("@config/database"));
const index_1 = require("@models/index");
const appError_1 = require("@utils/appError");
const cache_1 = __importDefault(require("@config/cache"));
const getProfileById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheKey = `${userId}`;
    let profileCached = cache_1.default.get(cacheKey);
    if (profileCached)
        return profileCached;
    const result = yield index_1.Profile.findOne({
        attributes: ['balance'],
        where: { id: userId, type: 'client' },
        raw: true
    });
    cache_1.default.set(cacheKey, result, 2000);
    return result;
});
exports.getProfileById = getProfileById;
const updateClientBalance = (clientId, contractorId, payment) => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.default.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        // Step: 1 Check Balance
        // Get Latest balace of Client
        const clientProfile = yield index_1.Profile.findOne({
            attributes: ['balance'],
            where: { id: clientId, type: 'client' },
            raw: true,
            transaction: t
        });
        const clientBalance = clientProfile === null || clientProfile === void 0 ? void 0 : clientProfile.balance;
        if (!clientBalance)
            throw new Error(`Not able to fetch Client balance ClientId: ${clientId}`);
        if (clientBalance < payment)
            throw new appError_1.AppError(501, `Insufficient Fund ClientId: ${clientId}`);
        // Step: 2 Debit from the Client
        yield index_1.Profile.update({ balance: sequelize_1.default.literal(`balance - ${payment}`) }, {
            where: { id: clientId, type: 'client' },
            transaction: t
        });
        // Step: 3 Credit to Contractor
        yield index_1.Profile.update({ balance: sequelize_1.default.literal(`balance + ${payment}`) }, {
            where: { id: contractorId, type: 'contractor' },
            transaction: t
        });
    }));
});
exports.updateClientBalance = updateClientBalance;
