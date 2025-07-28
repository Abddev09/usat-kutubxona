import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/book-images/";

    // Papka bor-yo'qligini tekshir
    if (!fs.existsSync(uploadPath)) {
      // Agar yo'q bo'lsa, recursive yarat
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

export const uploadImages = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10 MB
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Faqat rasm fayllar yuklanadi!"));
    }
    cb(null, true);
  },
});
