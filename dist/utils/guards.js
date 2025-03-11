"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToDate = void 0;
/**
 * Convert to Date
 */
const convertToDate = (value) => {
    if (value instanceof Date)
        return value;
    if (typeof value === 'string') {
        const date = new Date(value);
        if (isNaN(date.getTime()))
            return null;
        return date;
    }
    return null;
};
exports.convertToDate = convertToDate;
