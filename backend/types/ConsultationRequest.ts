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
import type { DesignRequestImage, RequestStatus } from "./CustomDesignRequest";

class ConsultationRequest extends Model<
  InferAttributes<ConsultationRequest>,
  InferCreationAttributes<ConsultationRequest>
> {
  declare id: CreationOptional<number>;
  declare userId: CreationOptional<ForeignKey<User["id"]> | null>;
  declare fullName: string;
  declare email: string;
  declare phone: string;
  declare preferredContactMethod: string;
  declare questionSummary: string;
  declare preferredDays: CreationOptional<string | null>;
  declare preferredTimeWindow: CreationOptional<string | null>;
  declare inspirationImages: CreationOptional<DesignRequestImage[]>;
  declare status: CreationOptional<RequestStatus>;
  declare internalNotes: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ConsultationRequest.init(
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
    preferredContactMethod: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "preferred_contact_method",
    },
    questionSummary: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "question_summary",
    },
    preferredDays: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "preferred_days",
    },
    preferredTimeWindow: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "preferred_time_window",
    },
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
    tableName: "consultation_requests",
    timestamps: true,
    underscored: true,
  }
);

export default ConsultationRequest;
