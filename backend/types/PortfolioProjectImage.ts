import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import sequelize from "../config/database";
import PortfolioProject from "./PortfolioProject";

class PortfolioProjectImage extends Model<
  InferAttributes<PortfolioProjectImage>,
  InferCreationAttributes<PortfolioProjectImage>
> {
  declare id: CreationOptional<number>;
  declare projectId: ForeignKey<PortfolioProject["id"]>;
  declare imageUrl: string;
  declare imagePublicId: string;
  declare altEn: CreationOptional<string | null>;
  declare altAr: CreationOptional<string | null>;
  declare sortOrder: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

PortfolioProjectImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "project_id",
      references: {
        model: "portfolio_projects",
        key: "id",
      },
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: "image_url",
    },
    imagePublicId: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: "image_public_id",
    },
    altEn: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "alt_en",
    },
    altAr: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "alt_ar",
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "sort_order",
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
    },
  },
  {
    sequelize,
    tableName: "portfolio_project_images",
    timestamps: true,
    underscored: true,
  }
);

export default PortfolioProjectImage;
