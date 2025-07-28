// src/middlewares/uploadPDF.ts
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // ! Absolyut emas, project-root'dan nisbiy papka
    cb(null, path.resolve("uploads/pdfs"));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const uploadPDF = multer({
  storage,
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Faqat PDF fayl yuklash mumkin!"));
    } else {
      cb(null, true);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});
