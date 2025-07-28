import { Response } from "express";

export const sendSuccess = (
  res: Response,
  {
    data,
    message = "Amaliyot muvaffaqiyatli bajarildi",
    statusCode = 200,
  }: {
    data?: any;
    message?: string;
    statusCode?: number;
  }
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  {
    message = "Xatolik yuz berdi",
    errors = [],
    statusCode = 500,
  }: {
    message?: string;
    errors?: any[];
    statusCode?: number;
  }
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
