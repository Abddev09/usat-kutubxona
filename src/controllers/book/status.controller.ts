import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { Status } from "../../models/Status";
import { sendSuccess } from "../../utils/responseHandler";
import { ApiError } from "../../utils/ApiError";

// @router GET /api/status
// @desc Barcha statuslar
// @access Public
export const getAllStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const status = await Status.findAll();
    return sendSuccess(res, {
      message: "Barcha statuslar",
      data: status,
      statusCode: 200,
    });
  }
);

// @router GET /api/status/:id
// @desc Statusni topish
// @access Public
export const getStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const status = await Status.findByPk(id);
  if (!status) {
    throw new ApiError(404, "Status topilmadi");
  }
  return sendSuccess(res, {
    message: "Status topildi",
    data: status,
    statusCode: 200,
  });
});

// @router POST /api/status
// @desc Status qo'shish
// @access Private
export const createStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const status = await Status.create(req.body);
    return sendSuccess(res, {
      message: "Status muvaffaqiyatli qo'shildi",
      data: status,
      statusCode: 200,
    });
  }
);

// @router PUT /api/status/:id
// @desc Statusni o'zgartirish
// @access Private
export const updateStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const status = await Status.findByPk(id);
    if (!status) {
      throw new ApiError(404, "Status topilmadi");
    }
    await status.update(req.body);
    return sendSuccess(res, {
      message: "Status muvaffaqiyatli yangilandi",
      data: status,
      statusCode: 200,
    });
  }
);

// @router DELETE /api/status/:id
// @desc Statusni o'chirish
// @access Private
export const deleteStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const status = await Status.findByPk(id);
    if (!status) {
      throw new ApiError(404, "Status topilmadi");
    }
    await status.destroy();
    return sendSuccess(res, {
      message: "Status muvaffaqiyatli o'chirildi",
      data: status,
      statusCode: 200,
    });
  }
);
