import { Model, ModelStatic, Op } from "sequelize";
import CustomDesignRequest, {
  DesignRequestImage,
  RequestStatus,
} from "../types/CustomDesignRequest";
import SpecialPieceRequest from "../types/SpecialPieceRequest";
import ConsultationRequest from "../types/ConsultationRequest";
import { UploadedAsset } from "../utils/cloudinary";

export interface QueueFilters {
  page?: number;
  limit?: number;
  status?: RequestStatus | "all";
  search?: string;
}

export interface CustomRequestPayload {
  userId?: number | null;
  fullName: string;
  email: string;
  phone: string;
  projectTypeOrSpace: string;
  visionDescription: string;
  stylePreferences?: string | null;
  dimensions?: string | null;
  budget?: string | null;
  timeline?: string | null;
}

export interface SpecialPiecePayload {
  userId?: number | null;
  fullName: string;
  email: string;
  phone: string;
  desiredPieceType: string;
  visionDescription: string;
  dimensions?: string | null;
  budget?: string | null;
  timeline?: string | null;
}

export interface ConsultationPayload {
  userId?: number | null;
  fullName: string;
  email: string;
  phone: string;
  preferredContactMethod: string;
  questionSummary: string;
  preferredDays?: string | null;
  preferredTimeWindow?: string | null;
}

export interface QueueUpdatePayload {
  status?: RequestStatus;
  internalNotes?: string | null;
}

type RequestModel = Model & {
  get(options?: { plain: true }): Record<string, unknown>;
  update(values: Record<string, unknown>): Promise<RequestModel>;
};

type RequestModelStatic = ModelStatic<RequestModel>;

class DesignRequestService {
  private toImages(images: UploadedAsset[] = []): DesignRequestImage[] {
    return images.map((image) => ({
      url: image.url,
      publicId: image.publicId,
    }));
  }

  private async listQueue(model: RequestModelStatic, filters: QueueFilters = {}) {
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const offset = (page - 1) * limit;
    const where: Record<string, unknown> & {
      [Op.or]?: Record<string, unknown>[];
    } = {};

    if (filters.status && filters.status !== "all") {
      where.status = filters.status;
    }

    if (filters.search?.trim()) {
      where[Op.or] = [
        { fullName: { [Op.iLike]: `%${filters.search.trim()}%` } },
        { email: { [Op.iLike]: `%${filters.search.trim()}%` } },
        { phone: { [Op.iLike]: `%${filters.search.trim()}%` } },
      ];
    }

    const { count, rows } = await model.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return {
      data: rows.map((row) => row.get({ plain: true })),
      meta: {
        totalItems: count,
        itemsPerPage: limit,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      },
    };
  }

  private async getQueueItem(model: RequestModelStatic, id: number) {
    const item = await model.findByPk(id);
    return item?.get({ plain: true }) || null;
  }

  private async updateQueueItem(
    model: RequestModelStatic,
    id: number,
    updates: QueueUpdatePayload
  ) {
    const item = await model.findByPk(id);
    if (!item) return null;

    await item.update({
      ...(updates.status ? { status: updates.status } : {}),
      ...(updates.internalNotes !== undefined
        ? { internalNotes: updates.internalNotes }
        : {}),
    });

    return item.get({ plain: true });
  }

  async createCustomRequest(payload: CustomRequestPayload, uploadedImages: UploadedAsset[] = []) {
    const request = await CustomDesignRequest.create({
      ...payload,
      inspirationImages: this.toImages(uploadedImages),
    });
    return request.get({ plain: true });
  }

  async createSpecialPieceRequest(
    payload: SpecialPiecePayload,
    uploadedImages: UploadedAsset[] = []
  ) {
    const request = await SpecialPieceRequest.create({
      ...payload,
      inspirationImages: this.toImages(uploadedImages),
    });
    return request.get({ plain: true });
  }

  async createConsultationRequest(
    payload: ConsultationPayload,
    uploadedImages: UploadedAsset[] = []
  ) {
    const request = await ConsultationRequest.create({
      ...payload,
      inspirationImages: this.toImages(uploadedImages),
    });
    return request.get({ plain: true });
  }

  listCustomRequests(filters: QueueFilters) {
    return this.listQueue(CustomDesignRequest as unknown as RequestModelStatic, filters);
  }

  listSpecialPieceRequests(filters: QueueFilters) {
    return this.listQueue(SpecialPieceRequest as unknown as RequestModelStatic, filters);
  }

  listConsultationRequests(filters: QueueFilters) {
    return this.listQueue(ConsultationRequest as unknown as RequestModelStatic, filters);
  }

  getCustomRequest(id: number) {
    return this.getQueueItem(CustomDesignRequest as unknown as RequestModelStatic, id);
  }

  getSpecialPieceRequest(id: number) {
    return this.getQueueItem(SpecialPieceRequest as unknown as RequestModelStatic, id);
  }

  getConsultationRequest(id: number) {
    return this.getQueueItem(ConsultationRequest as unknown as RequestModelStatic, id);
  }

  updateCustomRequest(id: number, updates: QueueUpdatePayload) {
    return this.updateQueueItem(
      CustomDesignRequest as unknown as RequestModelStatic,
      id,
      updates
    );
  }

  updateSpecialPieceRequest(id: number, updates: QueueUpdatePayload) {
    return this.updateQueueItem(
      SpecialPieceRequest as unknown as RequestModelStatic,
      id,
      updates
    );
  }

  updateConsultationRequest(id: number, updates: QueueUpdatePayload) {
    return this.updateQueueItem(
      ConsultationRequest as unknown as RequestModelStatic,
      id,
      updates
    );
  }
}

export const designRequestService = new DesignRequestService();
