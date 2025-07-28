import { Model } from "sequelize";
import { UserAttributes } from "./User";
import { BookAttributes } from "./Book";

// USER
export interface UserInstance extends Model {
  id: number;
  full_name: string;
  passport_id: string;
  phone: string;
  password: string;
  deletedAt?: Date | null;
}

// GROUP
export interface GroupInstance extends Model {
  id: number;
  name: string;
  can_login: boolean;
}

// USERGROUP
export interface UserGroupInstance extends Model {
  id: number;
  user_id: number;
  group_id: number;
  can_login: boolean;
  groupInfo?: GroupInstance; // 💥 Qo‘shiladi
}

// PERMISSION
export interface PermissionInstance extends Model {
  id: number;
  name: string;
  code_name: string;
  table?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// GROUPPERMISSION
export interface GroupPermissionInstance extends Model {
  id: number;
  group_id: number;
  permission_id: number;
  Permission?: PermissionInstance; // 💥 Qo‘shiladi
}

export interface UserOrderAttributes {
  id: number;
  user_id: number;
  book_id: number;
  status_id: number;
  created_at: Date;
  book_code: string | null;
  finished_at?: Date | null;
  taking_at?: Date | null;
  book_count: number;
  User?: UserAttributes;
  Book?: BookAttributes;
}

export interface UserOrderInstance
  extends Model<UserOrderAttributes, Partial<UserOrderAttributes>>,
    UserOrderAttributes {}

export interface BookItemAttributes {
  id: number;
  book_id: number;
  language_id: number;
  alphabet_id: number;
  status_id?: number;
  pdf_url?: string;
}

export interface BookItemInstance
  extends Model<BookItemAttributes>,
    BookItemAttributes {}
