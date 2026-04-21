import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Association,
  HasManyGetAssociationsMixin,
  NonAttribute,
} from "sequelize";
import sequelize from "../config/database";
import PortfolioProjectImage from "./PortfolioProjectImage";

class PortfolioProject extends Model<
  InferAttributes<PortfolioProject>,
  InferCreationAttributes<PortfolioProject>
> {
  declare id: CreationOptional<number>;
  declare slug: string;
  declare titleEn: string;
  declare titleAr: string;
  declare summaryEn: string;
  declare summaryAr: string;
  declare descriptionEn: string;
  declare descriptionAr: string;
  declare coverImageUrl: CreationOptional<string | null>;
  declare coverImagePublicId: CreationOptional<string | null>;
  declare active: CreationOptional<boolean>;
  declare sortOrder: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare getGalleryImages: HasManyGetAssociationsMixin<PortfolioProjectImage>;
  declare galleryImages?: NonAttribute<PortfolioProjectImage[]>;

  declare static associations: {
    galleryImages: Association<PortfolioProject, PortfolioProjectImage>;
  };
}

PortfolioProject.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },
    titleEn: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "title_en",
    },
    titleAr: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "title_ar",
    },
    summaryEn: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "summary_en",
    },
    summaryAr: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "summary_ar",
    },
    descriptionEn: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "description_en",
    },
    descriptionAr: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "description_ar",
    },
    coverImageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "cover_image_url",
    },
    coverImagePublicId: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "cover_image_public_id",
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    tableName: "portfolio_projects",
    timestamps: true,
    underscored: true,
  }
);

export default PortfolioProject;
