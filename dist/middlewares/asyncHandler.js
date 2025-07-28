"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
// Har qanday async controller'ni o‘raydi va xatolikni next() bilan errorHandler ga yuboradi
const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
