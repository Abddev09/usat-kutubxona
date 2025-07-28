"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBookItem = exports.updateBookItem = exports.createBookItem = exports.getBookItem = exports.getAllBookItems = void 0;
const asyncHandler_1 = require("../../middlewares/asyncHandler");
const models_1 = require("../../models");
const responseHandler_1 = require("../../utils/responseHandler");
const ApiError_1 = require("../../utils/ApiError");
const upload_1 = require("../../middlewares/upload");
const pdfFile_1 = require("../../models/book/pdfFile");
const imageFile_1 = require("../../models/book/imageFile");
// @router GET /api/bookItems
// @desc Barcha kitoblar
// @access Public
exports.getAllBookItems = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const bookItems = await models_1.BookItem.findAll({
        include: [
            {
                model: models_1.Book,
                include: [
                    {
                        model: models_1.Auther,
                    },
                    {
                        model: imageFile_1.ImageFile,
                        as: "image",
                    },
                ],
            },
            {
                model: models_1.Language,
            },
            {
                model: models_1.Alphabet,
            },
            {
                model: models_1.Status,
            },
            {
                model: pdfFile_1.PDFFile,
                attributes: ["id", "file_url", "original_name", "file_size"],
            },
            {
                model: models_1.BookCategoryKafedra,
                as: "BookCategoryKafedra",
                attributes: ["category_id", "kafedra_id"],
                include: [
                    {
                        model: models_1.Category,
                        as: "category",
                        attributes: ["id", "name_uz", "name_ru"],
                    },
                    {
                        model: models_1.Kafedra,
                        as: "kafedra",
                        attributes: ["id", "name_uz", "name_ru"],
                    },
                ],
            },
        ],
        order: [["id", "ASC"]],
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Barcha kitoblar",
        data: bookItems,
        statusCode: 200,
    });
});
// @router GET /api/bookItems/:id
// @desc Kitobni topish
// @access Public
exports.getBookItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const bookItem = await models_1.BookItem.findByPk(id);
    if (!bookItem) {
        throw new ApiError_1.ApiError(404, "Kitob topilmadi");
    }
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kitob topildi",
        data: bookItem,
        statusCode: 200,
    });
});
// @router POST /api/bookItems
// @desc Kitob qo'shish
// @access Private
exports.createBookItem = [
    upload_1.uploadPDF.single("pdf"),
    (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { book_id, language_id, alphabet_id, status_id, category_id, kafedra_id, } = req.body;
        // Majburiy maydonlarni tekshirish
        if (!book_id ||
            !language_id ||
            !alphabet_id ||
            !category_id ||
            !kafedra_id) {
            throw new ApiError_1.ApiError(400, "Majburiy maydonlar (book_id, language_id, alphabet_id, category_id, kafedra_id) to'ldirilishi shart");
        }
        // Agar fayl kelmagan bo'lsa
        if (!req.file) {
            throw new ApiError_1.ApiError(400, "PDF fayl yuborilishi shart");
        }
        // PDF faylni alohida jadvalga yozish
        const pdfFile = await pdfFile_1.PDFFile.create({
            file_url: `${process.env.BASE_URL}/uploads/pdfs/${req.file.filename}`,
            file_size: req.file.size,
            original_name: req.file.originalname,
        });
        // BookItem yaratish
        const bookItem = await models_1.BookItem.create({
            book_id: Number(book_id),
            language_id: Number(language_id),
            alphabet_id: Number(alphabet_id),
            status_id: status_id !== undefined ? Number(status_id) : null,
            pdf_id: pdfFile.getDataValue("id"),
        });
        // BookCategoryKafedra orqali kitobni kategoriya va kafedraga bog'lash
        await models_1.BookCategoryKafedra.findOrCreate({
            where: {
                book_id: bookItem.getDataValue("id"),
                category_id: Number(category_id),
                kafedra_id: Number(kafedra_id),
            },
        });
        return (0, responseHandler_1.sendSuccess)(res, {
            message: "Kitob muvaffaqiyatli qo'shildi",
            data: bookItem,
            statusCode: 201,
        });
    }),
];
// @router PUT /api/bookItems/:id
// @desc Kitobni yangilash
// @access Private
exports.updateBookItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const bookItem = await models_1.BookItem.findByPk(id);
    if (!bookItem) {
        throw new ApiError_1.ApiError(404, "Kitob topilmadi");
    }
    // Faqat yuborilgan maydonlarni ajratib olish
    const updateData = {};
    const { book_id, language_id, alphabet_id, status_id, pdf_url } = req.body;
    if (book_id !== undefined)
        updateData.book_id = book_id;
    if (language_id !== undefined)
        updateData.language_id = language_id;
    if (alphabet_id !== undefined)
        updateData.alphabet_id = alphabet_id;
    if (status_id !== undefined)
        updateData.status_id = status_id;
    if (pdf_url !== undefined)
        updateData.pdf_url = pdf_url;
    if (Object.keys(updateData).length === 0) {
        throw new ApiError_1.ApiError(400, "Hech bo‘lmasa bitta maydon yuboring");
    }
    await bookItem.update(updateData);
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kitob muvaffaqiyatli yangilandi",
        data: bookItem,
        statusCode: 200,
    });
});
// @router DELETE /api/bookItems/:id
// @desc Kitobni o'chirish
// @access Private
exports.deleteBookItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const bookItem = await models_1.BookItem.findByPk(id);
    if (!bookItem) {
        throw new ApiError_1.ApiError(404, "Kitob topilmadi");
    }
    await bookItem.destroy();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kitob muvaffaqiyatli o'chirildi",
        data: bookItem,
        statusCode: 200,
    });
});
