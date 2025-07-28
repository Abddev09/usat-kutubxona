import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import {  StudentGroup,  } from "../models/";
import { sendSuccess } from "../utils/responseHandler";
import { ApiError } from "../utils/ApiError";
// @router  GET /api/student-groups
// @desc Barcha yo‘nalishlar (kafedrasi bilan)
// @access Private
export const getAllStudentGroups = asyncHandler(
  async (req: Request, res: Response) => {
    const groups = await StudentGroup.findAll();

    return sendSuccess(res, {
      message: "Barcha guruhlar, yo‘nalish va kafedralari bilan",
      data: groups,
      statusCode: 200,
    });
  }
);

// @router GET /api/student-groups/:id
// @desc Guruhni topish
// @access Private
export const getStudentGroup = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const studentGroup = await StudentGroup.findByPk(id);
    if (!studentGroup) {
      throw new ApiError(404, "Guruh topilmadi");
    }
    return sendSuccess(res, {
      message: "Guruh topildi",
      data: studentGroup,
      statusCode: 200,
    });
  }
);

// @router POST /api/student-groups
// @desc Guruh qo‘shish
// @access Private
export const createStudentGroup = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, yonalish_id } = req.body;
    const studentGroup = await StudentGroup.create({ name, yonalish_id });
    return sendSuccess(res, {
      message: "Guruh muvaffaqiyatli qo'shildi",
      data: studentGroup,
      statusCode: 200,
    });
  }
);

// @router PUT /api/student-groups/:id
// @desc Guruhni o'zgartirish
// @access Private
export const updateStudentGroup = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { name, yonalish } = req.body;
    const studentGroup = await StudentGroup.findByPk(id);
    if (!studentGroup) {
      throw new ApiError(404, "Guruh topilmadi");
    }
    await studentGroup.update({ name, yonalish });
    return sendSuccess(res, {
      message: "Guruh muvaffaqiyatli yangilandi",
      data: studentGroup,
      statusCode: 200,
    });
  }
);

// @router DELETE /api/student-groups/:id
// @desc Guruhni o'chirish
// @access Private
export const deleteStudentGroup = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const studentGroup = await StudentGroup.findByPk(id);
    if (!studentGroup) {
      throw new ApiError(404, "Guruh topilmadi");
    }
    await studentGroup.destroy();
    return sendSuccess(res, {
      message: "Guruh muvaffaqiyatli o'chirildi",
      data: studentGroup,
      statusCode: 200,
    });
  }
);
