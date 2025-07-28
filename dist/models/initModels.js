"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModels = void 0;
const Alphabet_1 = require("./book/Alphabet");
const Auther_1 = require("./book/Auther");
const Book_1 = require("./book/Book");
const BookCategory_1 = require("./book/BookCategory");
const BookItem_1 = require("./book/BookItem");
const Category_1 = require("./book/Category");
const Language_1 = require("./book/Language");
const Kafedra_1 = require("./Kafedra");
const Status_1 = require("./Status");
const StudentGroup_1 = require("./StudentGroup");
const User_1 = require("./User");
const UserOrder_1 = require("./UserOrder");
const Yonalish_1 = require("./Yonalish");
const Group_1 = require("./Group");
const GroupPermission_1 = require("./GroupPermission");
const Permission_1 = require("./Permission");
const UserGroup_1 = require("./UserGroup");
const OrderHistory_1 = require("./OrderHistory");
const BookGiven_1 = require("./BookGiven");
const pdfFile_1 = require("./book/pdfFile");
const BookCategoryKafedra_1 = require("./BookCategoryKafedra");
const imageFile_1 = require("./book/imageFile");
const initModels = () => {
    // === 1:N Relationships ===
    Kafedra_1.Kafedra.hasMany(BookItem_1.BookItem, { foreignKey: "kafedra_id" });
    BookItem_1.BookItem.belongsTo(Kafedra_1.Kafedra, { foreignKey: "kafedra_id" });
    Book_1.Book.belongsTo(Auther_1.Auther, { as: "Auther", foreignKey: "auther_id" });
    BookItem_1.BookItem.belongsTo(pdfFile_1.PDFFile, { foreignKey: "pdf_id" });
    pdfFile_1.PDFFile.hasMany(BookItem_1.BookItem, { foreignKey: "pdf_id" });
    Category_1.Category.belongsToMany(Kafedra_1.Kafedra, {
        through: BookCategoryKafedra_1.BookCategoryKafedra,
        foreignKey: "category_id",
        otherKey: "kafedra_id",
        as: "kafedralar",
    });
    BookItem_1.BookItem.hasOne(BookCategoryKafedra_1.BookCategoryKafedra, {
        foreignKey: "book_id",
        as: "BookCategoryKafedra",
    });
    BookCategoryKafedra_1.BookCategoryKafedra.belongsTo(BookItem_1.BookItem, {
        foreignKey: "book_id",
        as: "BookItem",
    });
    BookCategoryKafedra_1.BookCategoryKafedra.belongsTo(Book_1.Book, { foreignKey: "book_id", as: "book" });
    Book_1.Book.hasMany(BookCategoryKafedra_1.BookCategoryKafedra, { foreignKey: "book_id" });
    BookCategoryKafedra_1.BookCategoryKafedra.belongsTo(Kafedra_1.Kafedra, { foreignKey: "kafedra_id" });
    Kafedra_1.Kafedra.hasMany(BookCategoryKafedra_1.BookCategoryKafedra, { foreignKey: "kafedra_id" });
    Kafedra_1.Kafedra.belongsToMany(Category_1.Category, {
        through: BookCategoryKafedra_1.BookCategoryKafedra,
        foreignKey: "kafedra_id",
        otherKey: "category_id",
        as: "kategoriyalar",
    });
    BookCategoryKafedra_1.BookCategoryKafedra.belongsTo(Category_1.Category, {
        foreignKey: "category_id",
        as: "category",
    });
    BookCategoryKafedra_1.BookCategoryKafedra.belongsTo(Kafedra_1.Kafedra, {
        foreignKey: "kafedra_id",
        as: "kafedra",
    });
    // Book ↔ Category Many-to-Many
    Book_1.Book.belongsToMany(Category_1.Category, {
        through: BookCategory_1.BookCategory,
        foreignKey: "book_id",
        otherKey: "category_id",
        as: "categories",
    });
    Category_1.Category.belongsToMany(Book_1.Book, {
        through: BookCategory_1.BookCategory,
        foreignKey: "category_id",
        otherKey: "book_id",
        as: "books",
    });
    Yonalish_1.Yonalish.hasMany(StudentGroup_1.StudentGroup, { foreignKey: "yonalish_id" });
    StudentGroup_1.StudentGroup.belongsTo(Yonalish_1.Yonalish, { foreignKey: "yonalish_id" });
    StudentGroup_1.StudentGroup.hasMany(User_1.User, { foreignKey: "student_group_id" });
    User_1.User.belongsTo(StudentGroup_1.StudentGroup, { foreignKey: "student_group_id" });
    Auther_1.Auther.hasMany(Book_1.Book, { foreignKey: "auther_id" });
    Book_1.Book.belongsTo(Auther_1.Auther, { foreignKey: "auther_id" });
    Status_1.Status.hasMany(BookItem_1.BookItem, { foreignKey: "status_id" });
    BookItem_1.BookItem.belongsTo(Status_1.Status, { foreignKey: "status_id" });
    Language_1.Language.hasMany(BookItem_1.BookItem, { foreignKey: "language_id" });
    BookItem_1.BookItem.belongsTo(Language_1.Language, { foreignKey: "language_id" });
    Alphabet_1.Alphabet.hasMany(BookItem_1.BookItem, { foreignKey: "alphabet_id" });
    BookItem_1.BookItem.belongsTo(Alphabet_1.Alphabet, { foreignKey: "alphabet_id" });
    // Fixed: book_id
    Book_1.Book.hasMany(BookItem_1.BookItem, { as: "BookItems", foreignKey: "book_id" });
    BookItem_1.BookItem.belongsTo(Book_1.Book, { foreignKey: "book_id" });
    User_1.User.hasMany(UserOrder_1.UserOrder, { foreignKey: "user_id" });
    UserOrder_1.UserOrder.belongsTo(User_1.User, { foreignKey: "user_id", as: "User" });
    Book_1.Book.hasMany(UserOrder_1.UserOrder, { foreignKey: "book_id" });
    UserOrder_1.UserOrder.belongsTo(Book_1.Book, { foreignKey: "book_id", as: "Book" });
    // === Many-to-Many: User ↔ Group ===
    User_1.User.belongsToMany(Group_1.Group, {
        through: UserGroup_1.UserGroup,
        foreignKey: "user_id",
        otherKey: "group_id",
        as: "groups",
    });
    Group_1.Group.belongsToMany(User_1.User, {
        through: UserGroup_1.UserGroup,
        foreignKey: "group_id",
        otherKey: "user_id",
        as: "users",
    });
    UserGroup_1.UserGroup.belongsTo(User_1.User, { foreignKey: "user_id", as: "user" });
    UserGroup_1.UserGroup.belongsTo(Group_1.Group, { foreignKey: "group_id", as: "groupInfo" });
    User_1.User.hasMany(UserGroup_1.UserGroup, { foreignKey: "user_id", as: "userGroups" });
    Group_1.Group.hasMany(UserGroup_1.UserGroup, { foreignKey: "group_id", as: "userGroups" });
    // === Many-to-Many: Group ↔ Permission ===
    Group_1.Group.belongsToMany(Permission_1.Permission, {
        through: GroupPermission_1.GroupPermission,
        foreignKey: "group_id",
        otherKey: "permission_id",
        as: "permissions",
    });
    Permission_1.Permission.belongsToMany(Group_1.Group, {
        through: GroupPermission_1.GroupPermission,
        foreignKey: "permission_id",
        otherKey: "group_id",
        as: "groups",
    });
    GroupPermission_1.GroupPermission.belongsTo(Group_1.Group, { foreignKey: "group_id", as: "groupInfo" });
    GroupPermission_1.GroupPermission.belongsTo(Permission_1.Permission, {
        foreignKey: "permission_id",
        as: "permissionInfo",
    });
    Group_1.Group.hasMany(GroupPermission_1.GroupPermission, {
        foreignKey: "group_id",
        as: "groupPermissions",
    });
    Permission_1.Permission.hasMany(GroupPermission_1.GroupPermission, {
        foreignKey: "permission_id",
        as: "groupPermissions",
    });
    OrderHistory_1.OrderHistory.belongsTo(User_1.User, {
        foreignKey: "performed_by",
        as: "AdminUser",
    });
    OrderHistory_1.OrderHistory.belongsTo(UserOrder_1.UserOrder, {
        foreignKey: "user_order_id",
        as: "UserOrder",
    });
    BookGiven_1.BookGiven.belongsTo(UserOrder_1.UserOrder, { foreignKey: "user_order_id" });
    BookGiven_1.BookGiven.belongsTo(User_1.User, { foreignKey: "admin_id", as: "admin" });
    Book_1.Book.belongsTo(imageFile_1.ImageFile, { foreignKey: "image_id", as: "image" });
    imageFile_1.ImageFile.hasMany(Book_1.Book, { foreignKey: "image_id" });
};
exports.initModels = initModels;
