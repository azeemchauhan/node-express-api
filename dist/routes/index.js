"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRouter = exports.jobRouter = exports.adminRouter = exports.contractRouter = void 0;
const contract_1 = __importDefault(require("@routes/contract"));
exports.contractRouter = contract_1.default;
const job_1 = __importDefault(require("@routes/job"));
exports.jobRouter = job_1.default;
const admin_1 = __importDefault(require("@routes/admin"));
exports.adminRouter = admin_1.default;
const payment_1 = __importDefault(require("@routes/payment"));
exports.paymentRouter = payment_1.default;
