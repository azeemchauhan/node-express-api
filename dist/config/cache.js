"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * In-Memory Cache | In Production this should be Distributed
 */
const node_cache_1 = __importDefault(require("node-cache"));
exports.default = new node_cache_1.default();
;
