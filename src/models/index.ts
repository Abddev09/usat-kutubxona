import { Group } from "./Group";
import { User } from "./User";
import { UserGroup } from "./UserGroup";
import { Permission } from "./Permission";
import { GroupPermission } from "./GroupPermission";
import { Kafedra } from "./Kafedra";
import { Yonalish } from "./Yonalish";
import { BookCategoryKafedra } from "./BookCategoryKafedra";
import { StudentGroup } from "./StudentGroup";
import { Auther } from "./book/Auther";
import { Language } from "./book/Language";
import { Alphabet } from "./book/Alphabet";
import { Status } from "./Status";
import { Book } from "./book/Book";
import { BookItem } from "./book/BookItem";
import { initModels } from "./initModels";
import { Category } from "./book/Category";
import { BookCategory } from "./book/BookCategory";
import { UserOrder } from "./UserOrder";
export {
  initModels,
  Group,
  User,
  UserGroup,
  Permission,
  GroupPermission,
  Kafedra,
  Yonalish,
  StudentGroup,
  Auther,
  Language,
  Alphabet,
  Status,
  Book,
  BookItem,
  Category,
  BookCategory,
  UserOrder,
  BookCategoryKafedra,
};

export const SequelizeModels = {
  Book,
  User,
  UserOrder,
};
