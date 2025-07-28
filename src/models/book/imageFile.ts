import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../config/db";

export class ImageFile extends Model {
  public id!: number;
  public filename!: string;
  public path!: string;
  public url!: string;
  public mimetype!: string;
  public size!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ImageFile.init(
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    filename: { type: DataTypes.STRING, allowNull: false },
    path: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    mimetype: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    tableName: "image_files",
    timestamps: true,
  }
);
