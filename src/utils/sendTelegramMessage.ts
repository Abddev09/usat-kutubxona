import axios from "axios";

export const sendTelegramMessage = async (chatId: string, text: string) => {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const apiUrl = process.env.TELEGRAM_API_URL;

    if (!token || !apiUrl) {
      throw new Error(
        "Telegram token yoki API URL topilmadi (env noto‘g‘ri sozlangan bo'lishi mumkin)"
      );
    }

    const url = `${apiUrl}/bot${token}/sendMessage`;

    const payload = {
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    };
    console.log(url, payload);
    const response = await axios.post(url, payload);

    if (response.data?.ok !== true) {
      console.error("❌ Telegram javobi noto‘g‘ri:", response.data);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Telegram Axios xatosi:", {
        message: error.message,
        response: error.response?.data,
      });
    } else {
      console.error("❌ Telegram xatolik:", error);
    }
  }
};
