import { asyncHandler } from "../middlewares/asyncHandler";
import { sendSuccess } from "../utils/responseHandler";
import { Request, Response } from "express";
// @router logic/dashboard
// @desc Kitoblar soni, Userlar soni , Foydalanishga berilgan kitoblar soni,
// @Privete
export const dashboardNumber = asyncHandler(
  async (req: Request, res: Response) => {
    const { Book, User, UserOrder } = req.models;

    const [books, users, issued] = await Promise.all([
      Book.count(),
      User.count(),
      UserOrder.count({
        where: {
          status_id: 2, // faqat berilganlar (optional: depends on your status system)
        },
      }),
    ]);

    return sendSuccess(res, {
      message: "Dashboard statistikasi muvaffaqiyatli qaytarildi",
      data: {
        books,
        users,
        issued,
      },
      statusCode: 200,
    });
  }
);
