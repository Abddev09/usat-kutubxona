"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImages = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "uploads/book-images/";
        // Papka bor-yo'qligini tekshir
        if (!fs_1.default.existsSync(uploadPath)) {
            // Agar yo'q bo'lsa, recursive yarat
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path_1.default.extname(file.originalname));
    },
});
exports.uploadImages = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Max 10 MB
    fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Faqat rasm fayllar yuklanadi!"));
        }
        cb(null, true);
    },
});
