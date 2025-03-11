"use strict";
/**
 * Job Related Routes
 */
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
const express_1 = __importDefault(require("express"));
const appError_1 = require("@utils/appError");
const logger_1 = __importDefault(require("@utils/logger"));
const validations_1 = require("@utils/validations");
const jobQueries_1 = require("@data/jobQueries");
const profileQueries_1 = require("@data/profileQueries");
const router = express_1.default.Router({ mergeParams: true });
/**
 * Get all unpaid jobs for a user (**_either_** a client or contractor),
 * but only for **_active contracts_**.
 */
router.get('/unpaid', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const userProfile = request.context.user;
    const userType = userProfile.type == 'client' ? 'Client' : 'Contractor';
    const unpaidJobs = yield (0, jobQueries_1.getAllUnpaidJobs)(userProfile.id, userType);
    response.json(unpaidJobs);
}));
/**
 * Pay for a job. A client can only pay if their balance is greater than or equal to the amount due.
 * The payment amount should be moved from the client's balance to the contractor's balance.
*/
router.post('/:job_id/pay', (0, validations_1.numberValidatorParam)('job_id'), (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userProfile = request.context.user;
    const jobId = parseInt(request.params.job_id);
    const userType = userProfile.type == 'client' ? 'Client' : 'Contractor';
    if (userType === 'Contractor')
        throw new appError_1.AppError(401, "Unauthorized Users");
    const jobResult = yield (0, jobQueries_1.getJobById)(jobId);
    const jobAmount = jobResult === null || jobResult === void 0 ? void 0 : jobResult.price;
    const contractorId = jobResult === null || jobResult === void 0 ? void 0 : jobResult.contratorId;
    if (!jobAmount)
        throw new appError_1.AppError(400, `Job is not exists for Job ID: ${jobId}`);
    try {
        yield (0, profileQueries_1.updateClientBalance)(userProfile.id, contractorId, jobAmount);
        response.status(200).json({ message: `Payment of ${jobAmount} is successfull to Contractor ${contractorId}` });
    }
    catch (err) {
        logger_1.default.error(err);
        if (err instanceof appError_1.AppError) {
            next(err);
        }
        else {
            next(new appError_1.AppError(500, `Payment of ${jobAmount} was unsuccessfull.`));
        }
        ;
    }
    ;
}));
exports.default = router;
