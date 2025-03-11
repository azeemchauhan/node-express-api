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
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateValidatorQuery = exports.numberValidatorQuery = exports.numberValidatorParam = void 0;
const express_validator_1 = require("express-validator");
const appError_1 = require("./appError");
///////////////// VALIDATORS ////////////////////////
const numberValidator = (type) => {
    let validationOn = type === 'params' ? express_validator_1.param : express_validator_1.query;
    return (fieldName) => {
        return validationOn(fieldName)
            .customSanitizer((jobId) => __awaiter(void 0, void 0, void 0, function* () {
            const parsedJobID = parseInt(jobId);
            if (isNaN(parsedJobID)) {
                const message = `Invalid value passed in: ${express_validator_1.param}`;
                throw new appError_1.AppError(400, message);
            }
            return parsedJobID;
        }));
    };
};
const dateValidatorQuery = (param) => {
    return (0, express_validator_1.query)(param)
        .trim()
        .isEmpty()
        .customSanitizer((dateString) => __awaiter(void 0, void 0, void 0, function* () {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            const message = `Invalid date passed in ${param}`;
            throw new appError_1.AppError(400, message);
        }
        return date;
    }));
};
exports.dateValidatorQuery = dateValidatorQuery;
const numberValidatorParam = numberValidator('params');
exports.numberValidatorParam = numberValidatorParam;
const numberValidatorQuery = numberValidator('query');
exports.numberValidatorQuery = numberValidatorQuery;
