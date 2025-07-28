"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTelegramMessage = void 0;
const axios_1 = __importDefault(require("axios"));
const sendTelegramMessage = async (chatId, text) => {
    try {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const apiUrl = process.env.TELEGRAM_API_URL;
        if (!token || !apiUrl) {
            throw new Error("Telegram token yoki API URL topilmadi (env noto‘g‘ri sozlangan bo'lishi mumkin)");
        }
        const url = `${apiUrl}/bot${token}/sendMessage`;
        const payload = {
            chat_id: chatId,
            text,
            parse_mode: "HTML",
        };
        console.log(url, payload);
        const response = await axios_1.default.post(url, payload);
        if (response.data?.ok !== true) {
            console.error("❌ Telegram javobi noto‘g‘ri:", response.data);
        }
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error("❌ Telegram Axios xatosi:", {
                message: error.message,
                response: error.response?.data,
            });
        }
        else {
            console.error("❌ Telegram xatolik:", error);
        }
    }
};
exports.sendTelegramMessage = sendTelegramMessage;
