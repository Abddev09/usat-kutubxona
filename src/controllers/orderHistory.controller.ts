import { asyncHandler } from "../middlewares/asyncHandler";
import { User } from "../models";
import { OrderHistory } from "../models/OrderHistory";
import { sendSuccess } from "../utils/responseHandler";

// @router POST /api/order-history/:user_order_id
// @desc buyurma tarixini ko'rish
// @access Admin
export const getOrderHistory = asyncHandler(async (req, res) => {
  const { user_order_id } = req.params;

  const history = await OrderHistory.findAll({
    where: { user_order_id },
    include: [
      {
        model: User,
        as: "AdminUser",
        attributes: ["id", "full_name"],
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return sendSuccess(res, {
    message: "Buyurtma tarixlari",
    data: history,
    statusCode: 200,
  });
});
// @router GET /api/order-history
// @desc Get all order histories
// @access Admin
export const getAllOrderHistory = asyncHandler(async (req, res) => {
  const history = await OrderHistory.findAll({
    include: [
      {
        model: User,
        as: "AdminUser",
        attributes: ["id", "full_name"],
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return sendSuccess(res, {
    message: "Barcha buyurtma tarixlari",
    data: history,
    statusCode: 200,
  });
});

