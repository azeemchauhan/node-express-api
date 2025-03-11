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
* Admin Routes
*/
const express_1 = __importDefault(require("express"));
const adminQueries_1 = require("@data/adminQueries");
const guards_1 = require("@utils/guards");
const validations_1 = require("@utils/validations");
const router = express_1.default.Router({ mergeParams: true });
const bestProfessionValidation = [(0, validations_1.dateValidatorQuery)('start'), (0, validations_1.dateValidatorQuery)('end')];
const bestClientValidation = [(0, validations_1.dateValidatorQuery)('start'), (0, validations_1.dateValidatorQuery)('end'), (0, validations_1.numberValidatorQuery)('limit')];
/**
 * Returns the profession that earned the most money (sum of jobs paid)
 * for any contractor who worked within the specified time range.
 */
router.get('/best-profession', bestProfessionValidation, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const startDate = (0, guards_1.convertToDate)(request.query.start);
    const endDate = (0, guards_1.convertToDate)(request.query.end);
    const limit = 1;
    const result = yield (0, adminQueries_1.getBestProfession)(startDate, endDate, limit);
    const bestProfession = result && { name: result.name };
    response.status(200).json(bestProfession);
}));
/**
 * Returns the clients who paid the most for jobs within the specified time period.
 * The `limit` query parameter should be applied, and the default limit is 2.
 */
router.get('/best-clients', bestClientValidation, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const startDate = (0, guards_1.convertToDate)(request.query.start);
    const endDate = (0, guards_1.convertToDate)(request.query.end);
    const limit = (request.query.limits || 2);
    const bestClientsResult = yield (0, adminQueries_1.getBestClients)(startDate, endDate, limit);
    const bestClients = bestClientsResult.map((client => {
        return {
            id: client.id,
            fullName: `${client.firstName} ${client.lastName}`,
            paid: client.paid
        };
    }));
    response.status(200).json(bestClients);
}));
exports.default = router;
