export enum OrderStatus {
  CREATED = 1, // Buyurtma berildi
  READY_FOR_PICKUP = 2, // Kitobni olib ketishingiz mumkin
  READING = 3, // Kitob o'qilmoqda
  RETURN_DUE = 4, // Kitob topshirish vaqti keldi
  EXTENDED = 5, // Kitob topshirilishi kutilmoqda
  REJECTED = 6, // Buyurtma bekor qilindi
  OVERDUE = 7, // yoki BLACKLIST_PENDING
  ARCHIVED = 8, // Buyurtma arxivga o'tkazildi
}
