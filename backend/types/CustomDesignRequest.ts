import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import sequelize from "../config/database";
import User from "./User";

export type DesignRequestImage = {
  url: string;
  publicId: string;
  originalName?: string;
};

export type RequestStatus = "new" | "contacted" | "closed";

class CustomDesignRequest extends Model<
  InferAttributes<CustomDesignRequest>,
  InferCreationAttributes<CustomDesignRequest>
> {
  declare id: CreationOptional<number>;
  declare userId: CreationOptional<ForeignKey<User["id"]> | null>;
  declare fullName: string;
  declare email: string;
  declare phone: string;
  declare projectTypeOrSpace: string;
  declare visionDescription: string;
  declare stylePreferences: CreationOptional<string | null>;
  declare dimensions: CreationOptional<string | null>;
  declare budget: CreationOptional<string | null>;
  declare timeline: CreationOptional<string | null>;
  declare inspirationImages: CreationOptional<DesignRequestImage[]>;
  declare status: CreationOptional<RequestStatus>;
  declare internalNotes: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

CustomDesignRequest.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "user_id",
      references: {
        model: "users",
        key: "id",
      },
    },
    fullName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "full_name",
    },
    email: { type: DataTypes.STRING(255), allowNull: false },
    phone: { type: DataTypes.STRING(50), allowNull: false },
    projectTypeOrSpace: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "project_type_or_space",
    },
    visionDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "vision_description",
    },
    stylePreferences: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "style_preferences",
    },
    dimensions: { type: DataTypes.STRING(255), allowNull: true },
    budget: { type: DataTypes.STRING(255), allowNull: true },
    timeline: { type: DataTypes.STRING(255), allowNull: true },
    inspirationImages: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "inspiration_images",
    },
    status: {
      type: DataTypes.ENUM("new", "contacted", "closed"),
      allowNull: false,
      defaultValue: "new",
    },
    internalNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "internal_notes",
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
    tableName: "custom_design_requests",
    timestamps: true,
    underscored: true,
  }
);

export default CustomDesignRequest;
