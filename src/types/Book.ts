import { Optional } from "sequelize";

export interface BookAttributes {
  id: number;
  name: string;
  auther_id?: number | null;
  year: number;
  page: number;
  book_count: number;
  description?: string;
  image?: string;
  imgage?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CategoryKafedraAttributes {
  id: number;
  category_id: number;
  kafedra_id: number;
}
export interface BookCreationAttributes
  extends Optional<
    BookAttributes,
    "id" | "description" | "image" | "createdAt" | "updatedAt" | "deletedAt"
  > {}
