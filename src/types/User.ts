import { Model } from "sequelize";

export interface UserAttributes {
  id: number;
  full_name: string;
  phone: string;
  passport_id: string;
  password: string;
  telegram_id?: string | null; // ✅ Qo‘shildi
  student_group_id?: number | null;
  step?: number;
  language?: string | null;
  deletedAt?: Date | null;
}

export interface UserOrderInstance {
  id: number;
  user_id: number;
  book_id: number;
  status_id: number;
  created_at: Date;
  book_code: string;
  finished_at?: Date | null;
  taking_at?: Date | null;
  telegram_id?: string;
  language?: string;
  Book?: {
    id: number;
    name: string;
  };
  Status?: {
    id: number;
    name: string;
  };
}

export interface StudentGroupAttributes {
  id: number;
  name: string;
  direction_id: number;
}

export interface StudentGroupInstance
  extends Model<StudentGroupAttributes>,
    StudentGroupAttributes {
  Yonalish?: YonalishInstance;
}
export interface UserAttributes {
  id: number;
  full_name: string;
  phone: string;
}
export interface YonalishAttributes {
  id: number;
  name: string;
  department_id: number;
}

export interface YonalishInstance
  extends Model<YonalishAttributes>,
    YonalishAttributes {
  Kafedra?: KafedraInstance;
}
export interface KafedraAttributes {
  id: number;
  name: string;
}

export interface KafedraInstance
  extends Model<KafedraAttributes>,
    KafedraAttributes {}

export interface UserInstance extends Model<UserAttributes>, UserAttributes {
  StudentGroup?: StudentGroupInstance;
  UserOrders?: UserOrderInstance[];
}
