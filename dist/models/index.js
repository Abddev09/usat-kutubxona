"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequelizeModels = exports.BookCategoryKafedra = exports.UserOrder = exports.BookCategory = exports.Category = exports.BookItem = exports.Book = exports.Status = exports.Alphabet = exports.Language = exports.Auther = exports.StudentGroup = exports.Yonalish = exports.Kafedra = exports.GroupPermission = exports.Permission = exports.UserGroup = exports.User = exports.Group = exports.initModels = void 0;
const Group_1 = require("./Group");
Object.defineProperty(exports, "Group", { enumerable: true, get: function () { return Group_1.Group; } });
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const UserGroup_1 = require("./UserGroup");
Object.defineProperty(exports, "UserGroup", { enumerable: true, get: function () { return UserGroup_1.UserGroup; } });
const Permission_1 = require("./Permission");
Object.defineProperty(exports, "Permission", { enumerable: true, get: function () { return Permission_1.Permission; } });
const GroupPermission_1 = require("./GroupPermission");
Object.defineProperty(exports, "GroupPermission", { enumerable: true, get: function () { return GroupPermission_1.GroupPermission; } });
const Kafedra_1 = require("./Kafedra");
Object.defineProperty(exports, "Kafedra", { enumerable: true, get: function () { return Kafedra_1.Kafedra; } });
const Yonalish_1 = require("./Yonalish");
Object.defineProperty(exports, "Yonalish", { enumerable: true, get: function () { return Yonalish_1.Yonalish; } });
const BookCategoryKafedra_1 = require("./BookCategoryKafedra");
Object.defineProperty(exports, "BookCategoryKafedra", { enumerable: true, get: function () { return BookCategoryKafedra_1.BookCategoryKafedra; } });
const StudentGroup_1 = require("./StudentGroup");
Object.defineProperty(exports, "StudentGroup", { enumerable: true, get: function () { return StudentGroup_1.StudentGroup; } });
const Auther_1 = require("./book/Auther");
Object.defineProperty(exports, "Auther", { enumerable: true, get: function () { return Auther_1.Auther; } });
const Language_1 = require("./book/Language");
Object.defineProperty(exports, "Language", { enumerable: true, get: function () { return Language_1.Language; } });
const Alphabet_1 = require("./book/Alphabet");
Object.defineProperty(exports, "Alphabet", { enumerable: true, get: function () { return Alphabet_1.Alphabet; } });
const Status_1 = require("./Status");
Object.defineProperty(exports, "Status", { enumerable: true, get: function () { return Status_1.Status; } });
const Book_1 = require("./book/Book");
Object.defineProperty(exports, "Book", { enumerable: true, get: function () { return Book_1.Book; } });
const BookItem_1 = require("./book/BookItem");
Object.defineProperty(exports, "BookItem", { enumerable: true, get: function () { return BookItem_1.BookItem; } });
const initModels_1 = require("./initModels");
Object.defineProperty(exports, "initModels", { enumerable: true, get: function () { return initModels_1.initModels; } });
const Category_1 = require("./book/Category");
Object.defineProperty(exports, "Category", { enumerable: true, get: function () { return Category_1.Category; } });
const BookCategory_1 = require("./book/BookCategory");
Object.defineProperty(exports, "BookCategory", { enumerable: true, get: function () { return BookCategory_1.BookCategory; } });
const UserOrder_1 = require("./UserOrder");
Object.defineProperty(exports, "UserOrder", { enumerable: true, get: function () { return UserOrder_1.UserOrder; } });
exports.SequelizeModels = {
    Book: Book_1.Book,
    User: User_1.User,
    UserOrder: UserOrder_1.UserOrder,
};
