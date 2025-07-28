import { Alphabet } from "./book/Alphabet";
import { Auther } from "./book/Auther";
import { Book } from "./book/Book";
import { BookCategory } from "./book/BookCategory";
import { BookItem } from "./book/BookItem";
import { Category } from "./book/Category";
import { Language } from "./book/Language";
import { Kafedra } from "./Kafedra";
import { Status } from "./Status";
import { StudentGroup } from "./StudentGroup";
import { User } from "./User";
import { UserOrder } from "./UserOrder";
import { Yonalish } from "./Yonalish";
import { Group } from "./Group";
import { GroupPermission } from "./GroupPermission";
import { Permission } from "./Permission";
import { UserGroup } from "./UserGroup";
import { OrderHistory } from "./OrderHistory";
import { BookGiven } from "./BookGiven";
import { PDFFile } from "./book/pdfFile";
import { BookCategoryKafedra } from "./BookCategoryKafedra";
import { ImageFile } from "./book/imageFile";

export const initModels = () => {
  // === 1:N Relationships ===
  Kafedra.hasMany(BookItem, { foreignKey: "kafedra_id" });
  BookItem.belongsTo(Kafedra, { foreignKey: "kafedra_id" });
  Book.belongsTo(Auther, { as: "Auther", foreignKey: "auther_id" });

  BookItem.belongsTo(PDFFile, { foreignKey: "pdf_id" });
  PDFFile.hasMany(BookItem, { foreignKey: "pdf_id" });
  Category.belongsToMany(Kafedra, {
    through: BookCategoryKafedra,
    foreignKey: "category_id",
    otherKey: "kafedra_id",
    as: "kafedralar",
  });
  BookItem.hasOne(BookCategoryKafedra, {
    foreignKey: "book_id",
    as: "BookCategoryKafedra",
  });
  BookCategoryKafedra.belongsTo(BookItem, {
    foreignKey: "book_id",
    as: "BookItem",
  });
  BookCategoryKafedra.belongsTo(Book, { foreignKey: "book_id", as: "book" });
  Book.hasMany(BookCategoryKafedra, { foreignKey: "book_id" });
  BookCategoryKafedra.belongsTo(Kafedra, { foreignKey: "kafedra_id" });
  Kafedra.hasMany(BookCategoryKafedra, { foreignKey: "kafedra_id" });

  Kafedra.belongsToMany(Category, {
    through: BookCategoryKafedra,
    foreignKey: "kafedra_id",
    otherKey: "category_id",
    as: "kategoriyalar",
  });
  BookCategoryKafedra.belongsTo(Category, {
    foreignKey: "category_id",
    as: "category",
  });
  BookCategoryKafedra.belongsTo(Kafedra, {
    foreignKey: "kafedra_id",
    as: "kafedra",
  });
  // Book ↔ Category Many-to-Many
  Book.belongsToMany(Category, {
    through: BookCategory,
    foreignKey: "book_id",
    otherKey: "category_id",
    as: "categories",
  });
  Category.belongsToMany(Book, {
    through: BookCategory,
    foreignKey: "category_id",
    otherKey: "book_id",
    as: "books",
  });

  Yonalish.hasMany(StudentGroup, { foreignKey: "yonalish_id" });
  StudentGroup.belongsTo(Yonalish, { foreignKey: "yonalish_id" });

  StudentGroup.hasMany(User, { foreignKey: "student_group_id" });
  User.belongsTo(StudentGroup, { foreignKey: "student_group_id" });

  Auther.hasMany(Book, { foreignKey: "auther_id" });
  Book.belongsTo(Auther, { foreignKey: "auther_id" });

  Status.hasMany(BookItem, { foreignKey: "status_id" });
  BookItem.belongsTo(Status, { foreignKey: "status_id" });

  Language.hasMany(BookItem, { foreignKey: "language_id" });
  BookItem.belongsTo(Language, { foreignKey: "language_id" });

  Alphabet.hasMany(BookItem, { foreignKey: "alphabet_id" });
  BookItem.belongsTo(Alphabet, { foreignKey: "alphabet_id" });

  // Fixed: book_id
  Book.hasMany(BookItem, { as: "BookItems", foreignKey: "book_id" });
  BookItem.belongsTo(Book, { foreignKey: "book_id" });

  User.hasMany(UserOrder, { foreignKey: "user_id" });
  UserOrder.belongsTo(User, { foreignKey: "user_id", as: "User" });

  Book.hasMany(UserOrder, { foreignKey: "book_id" });
  UserOrder.belongsTo(Book, { foreignKey: "book_id", as: "Book" });

  // === Many-to-Many: User ↔ Group ===
  User.belongsToMany(Group, {
    through: UserGroup,
    foreignKey: "user_id",
    otherKey: "group_id",
    as: "groups",
  });
  Group.belongsToMany(User, {
    through: UserGroup,
    foreignKey: "group_id",
    otherKey: "user_id",
    as: "users",
  });

  UserGroup.belongsTo(User, { foreignKey: "user_id", as: "user" });
  UserGroup.belongsTo(Group, { foreignKey: "group_id", as: "groupInfo" });

  User.hasMany(UserGroup, { foreignKey: "user_id", as: "userGroups" });
  Group.hasMany(UserGroup, { foreignKey: "group_id", as: "userGroups" });

  // === Many-to-Many: Group ↔ Permission ===
  Group.belongsToMany(Permission, {
    through: GroupPermission,
    foreignKey: "group_id",
    otherKey: "permission_id",
    as: "permissions",
  });
  Permission.belongsToMany(Group, {
    through: GroupPermission,
    foreignKey: "permission_id",
    otherKey: "group_id",
    as: "groups",
  });

  GroupPermission.belongsTo(Group, { foreignKey: "group_id", as: "groupInfo" });
  GroupPermission.belongsTo(Permission, {
    foreignKey: "permission_id",
    as: "permissionInfo",
  });

  Group.hasMany(GroupPermission, {
    foreignKey: "group_id",
    as: "groupPermissions",
  });
  Permission.hasMany(GroupPermission, {
    foreignKey: "permission_id",
    as: "groupPermissions",
  });

  OrderHistory.belongsTo(User, {
    foreignKey: "performed_by",
    as: "AdminUser",
  });

  OrderHistory.belongsTo(UserOrder, {
    foreignKey: "user_order_id",
    as: "UserOrder",
  });

  BookGiven.belongsTo(UserOrder, { foreignKey: "user_order_id" });
  BookGiven.belongsTo(User, { foreignKey: "admin_id", as: "admin" });

  Book.belongsTo(ImageFile, { foreignKey: "image_id", as: "image" });
  ImageFile.hasMany(Book, { foreignKey: "image_id" });
};
