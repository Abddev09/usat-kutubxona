"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudentGroup = exports.updateStudentGroup = exports.createStudentGroup = exports.getStudentGroup = exports.getAllStudentGroups = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const models_1 = require("../models/");
const responseHandler_1 = require("../utils/responseHandler");
const ApiError_1 = require("../utils/ApiError");
// @router  GET /api/student-groups
// @desc Barcha yo‘nalishlar (kafedrasi bilan)
// @access Private
exports.getAllStudentGroups = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const groups = await models_1.StudentGroup.findAll();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Barcha guruhlar, yo‘nalish va kafedralari bilan",
        data: groups,
        statusCode: 200,
    });
});
// @router GET /api/student-groups/:id
// @desc Guruhni topish
// @access Private
exports.getStudentGroup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const studentGroup = await models_1.StudentGroup.findByPk(id);
    if (!studentGroup) {
        throw new ApiError_1.ApiError(404, "Guruh topilmadi");
    }
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Guruh topildi",
        data: studentGroup,
        statusCode: 200,
    });
});
// @router POST /api/student-groups
// @desc Guruh qo‘shish
// @access Private
exports.createStudentGroup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, yonalish_id } = req.body;
    const studentGroup = await models_1.StudentGroup.create({ name, yonalish_id });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Guruh muvaffaqiyatli qo'shildi",
        data: studentGroup,
        statusCode: 200,
    });
});
// @router PUT /api/student-groups/:id
// @desc Guruhni o'zgartirish
// @access Private
exports.updateStudentGroup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { name, yonalish } = req.body;
    const studentGroup = await models_1.StudentGroup.findByPk(id);
    if (!studentGroup) {
        throw new ApiError_1.ApiError(404, "Guruh topilmadi");
    }
    await studentGroup.update({ name, yonalish });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Guruh muvaffaqiyatli yangilandi",
        data: studentGroup,
        statusCode: 200,
    });
});
// @router DELETE /api/student-groups/:id
// @desc Guruhni o'chirish
// @access Private
exports.deleteStudentGroup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const studentGroup = await models_1.StudentGroup.findByPk(id);
    if (!studentGroup) {
        throw new ApiError_1.ApiError(404, "Guruh topilmadi");
    }
    await studentGroup.destroy();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Guruh muvaffaqiyatli o'chirildi",
        data: studentGroup,
        statusCode: 200,
    });
});
