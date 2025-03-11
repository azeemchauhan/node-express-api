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
exports.depositPayment = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importDefault(require("@config/database"));
const index_1 = require("@models/index");
const appError_1 = require("@utils/appError");
const depositPayment = (clientId, payment) => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.default.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        // Step: 1: Get Latest balace of Client
        const clientProfile = yield index_1.Profile.findOne({
            attributes: ['balance'],
            where: { id: clientId, type: 'client' },
            raw: true,
            transaction: t
        });
        // Step: 2: Get Latest due on Client
        const totalPendingPayment = yield index_1.Contract.findOne({
            include: [{ model: index_1.Job, attributes: [] }],
            attributes: [[database_1.default.fn('SUM', database_1.default.col('Jobs.price')), 'amount']],
            group: 'clientId',
            where: { clientId: 1, status: { [sequelize_1.default.Op.ne]: 'terminated' } },
            subQuery: false,
            raw: true,
            transaction: t
        });
        const balance = clientProfile === null || clientProfile === void 0 ? void 0 : clientProfile.balance;
        const pendingPayment = totalPendingPayment === null || totalPendingPayment === void 0 ? void 0 : totalPendingPayment.amount;
        if (!balance)
            throw new Error(`Not able to fetch Client balance ClientId: ${clientId}`);
        if (balance < payment)
            throw new appError_1.AppError(501, `Insufficient Fund ClientId: ${clientId}`);
        // A client cannot deposit more than 25% of the total of jobs to pay at the time of deposit.
        const acceptablePayment = (25 * parseFloat(pendingPayment)) / 100;
        if (payment > acceptablePayment)
            throw new appError_1.AppError(501, `The Client: ${clientId} can only deposit at most: ${acceptablePayment}`);
        // Step: 3 Move Amount from Client balance to Contrator's balance.
        yield index_1.Profile.update({ balance: sequelize_1.default.literal(`balance - ${acceptablePayment}`) }, {
            where: { id: clientId, type: 'client' },
            transaction: t
        });
    }));
});
exports.depositPayment = depositPayment;
