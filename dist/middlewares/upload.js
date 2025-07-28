"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPDF = void 0;
// src/middlewares/uploadPDF.ts
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        // ! Absolyut emas, project-root'dan nisbiy papka
        cb(null, path_1.default.resolve("uploads/pdfs"));
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
exports.uploadPDF = (0, multer_1.default)({
    storage,
    fileFilter: (_req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            cb(new Error("Faqat PDF fayl yuklash mumkin!"));
        }
        else {
            cb(null, true);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});
