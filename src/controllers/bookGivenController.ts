import { Request, Response } from "express";
import { BookGiven } from "../models/BookGiven";
import { UserOrder, User, Book } from "../models";
import { asyncHandler } from "../middlewares/asyncHandler";
import { sendSuccess } from "../utils/responseHandler";

// OrderStatus enum orqali olib kelamiz
const ACTIVE_STATUSES = [3, 4, 5, 7]; // READING, RETURN_DUE, EXTENDED, OVERDUE
// @router GET /api/book-given/active
// @desc Kitob bergan adminlar va u hali qaytarilmaganlar ro'yxati
// @access Admin
export const getActiveGivenBooks = asyncHandler(
  async (req: Request, res: Response) => {
    const results = await BookGiven.findAll({
      include: [
        {
          model: UserOrder,
          where: { status_id: ACTIVE_STATUSES },
          include: [
            {
              model: User,
              as: "User", // AS: "User" EXACT bo'lishi KERAK!
              attributes: ["id", "full_name", "phone"],
            },
            {
              model: Book,
              as: "Book",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: User,
          as: "admin",
          attributes: ["id", "full_name"],
        },
      ],
    });

    return sendSuccess(res, { data: results });
  }
);
