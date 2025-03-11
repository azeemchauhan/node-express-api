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
exports.addUserProfile = void 0;
const index_1 = require("@models/index");
const cache_1 = __importDefault(require("@config/cache"));
/**
 * Middleware to Add User Profile ( Client / Contractor) into the request.
 */
const addUserProfile = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const profileId = request.get('profile_id') || "0";
    let userProfile = cache_1.default.get(profileId);
    if (!userProfile) {
        userProfile = yield index_1.Profile.findOne({ where: { id: profileId } });
        userProfile && cache_1.default.set(profileId, userProfile, 2000);
    }
    if (!userProfile) {
        response.status(401).json({ message: "Authorization Failed." });
    }
    // Adding Current User Profile to Request context
    request.context.user = userProfile;
    next();
});
exports.addUserProfile = addUserProfile;
