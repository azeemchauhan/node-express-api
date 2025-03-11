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
 * All the Routes related to Contracts
 */
const express_1 = __importDefault(require("express"));
const appError_1 = require("@utils/appError");
const contractQueries_1 = require("@data/contractQueries");
const validations_1 = require("@utils/validations");
const router = express_1.default.Router({ mergeParams: true });
/**
 * Returns a list of contracts belonging to a user (client or contractor).
 * The list should only contain non-terminated contracts.
 */
router.get('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const userProfile = request.context.user;
    const userType = userProfile.type == 'client' ? 'Client' : 'Contractor';
    const contracts = yield (0, contractQueries_1.getActiveContracts)(userProfile.id, userType);
    response.json(contracts);
}));
/**
* Return the contract only if it belongs to the profile making the request.
*/
router.get('/:id', (0, validations_1.numberValidatorParam)('id'), (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const userProfile = request.context.user;
    const userType = userProfile.type == 'client' ? 'Client' : 'Contractor';
    const contractId = parseInt(request.params.id);
    const contract = yield (0, contractQueries_1.getContract)(userProfile.id, contractId, userType);
    if (!contract) {
        throw new appError_1.AppError(404, `contract is not exist for ${userType}: ${userProfile.id}`);
    }
    response.json(contract);
}));
exports.default = router;
