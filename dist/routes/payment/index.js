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
/**
 * All the Routes related to Payments
 */
const express_1 = __importDefault(require("express"));
const appError_1 = require("@utils/appError");
const logger_1 = __importDefault(require("@utils/logger"));
const validations_1 = require("@utils/validations");
const paymentQueries_1 = require("@data/paymentQueries");
const router = express_1.default.Router({ mergeParams: true });
/**
  * Deposit money into a client's balance.
  * A client cannot deposit more than 25% of the total of jobs to pay at the time of deposit.
*/
router.post('/deposit/:amount', (0, validations_1.numberValidatorParam)('amount'), (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userProfile = request.context.user;
    const depositAmount = parseFloat(request.params.amount);
    const userType = userProfile.type == 'client' ? 'Client' : 'Contractor';
    if (userType === 'Contractor')
        throw new appError_1.AppError(401, "Unauthorized");
    try {
        yield (0, paymentQueries_1.depositPayment)(userProfile.id, depositAmount);
        response
            .status(200)
            .json({ message: `Payment of ${depositAmount} is successfull to Debited from Client ${userProfile.id}` });
    }
    catch (err) {
        logger_1.default.error(err);
        if (err instanceof appError_1.AppError) {
            next(err);
        }
        else {
            next(new appError_1.AppError(500, `Payment of ${depositAmount} was unsuccessfull.`));
        }
        ;
    }
}));
exports.default = router;
