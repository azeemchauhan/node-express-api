"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const express_request_context_1 = __importDefault(require("express-request-context"));
const addUserProfile_1 = require("@middlewares/addUserProfile");
const index_1 = require("@routes/index");
const errorHandler_1 = __importDefault(require("@middlewares/errorHandler"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// This will enable the 'context' object for you.
app.use((0, express_request_context_1.default)());
app.use('/contracts', addUserProfile_1.addUserProfile, index_1.contractRouter);
app.use('/jobs', addUserProfile_1.addUserProfile, index_1.jobRouter);
app.use('/balance', addUserProfile_1.addUserProfile, index_1.paymentRouter);
app.use('/admin', index_1.adminRouter);
app.use(errorHandler_1.default);
module.exports = app;
