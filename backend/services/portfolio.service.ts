import { Includeable, Op, Order } from "sequelize";
import PortfolioProject from "../types/PortfolioProject";
import PortfolioProjectImage from "../types/PortfolioProjectImage";
import { deleteImageByPublicId, UploadedAsset } from "../utils/cloudinary";

export interface PortfolioProjectPayload {
  slug?: string;
  titleEn: string;
  titleAr: string;
  summaryEn: string;
  summaryAr: string;
  descriptionEn: string;
  descriptionAr: string;
  active?: boolean;
  sortOrder?: number;
}

export interface PortfolioImageMeta {
  id?: number;
  altEn?: string | null;
  altAr?: string | null;
  sortOrder?: number;
}

interface PortfolioUpsertOptions {
  coverImage?: UploadedAsset | null;
  removeCoverImage?: boolean;
  newGalleryImages?: UploadedAsset[];
  existingGallery?: PortfolioImageMeta[];
  removeGalleryImageIds?: number[];
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);

class PortfolioService {
  private getProjectInclude(): Includeable[] {
    return [
      {
        model: PortfolioProjectImage,
        as: "galleryImages",
      },
    ];
  }

  private getProjectOrder(): Order {
    return [
      ["sortOrder", "ASC"],
      ["createdAt", "DESC"],
      [{ model: PortfolioProjectImage, as: "galleryImages" }, "sortOrder", "ASC"],
    ];
  }

  private async ensureUniqueSlug(desired: string, excludeId?: number) {
    const baseSlug = slugify(desired || "portfolio-project") || "portfolio-project";
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await PortfolioProject.findOne({
        where: {
          slug,
          ...(excludeId ? { id: { [Op.ne]: excludeId } } : {}),
        },
      });

      if (!existing) {
        return slug;
      }

      counter += 1;
      slug = `${baseSlug}-${counter}`;
    }
  }

  private async deleteProjectAssets(
    plain: (PortfolioProject & { galleryImages?: PortfolioProjectImage[] }) | null
  ) {
    if (!plain) return;

    if (plain.coverImagePublicId) {
      await deleteImageByPublicId(plain.coverImagePublicId);
    }

    for (const image of plain.galleryImages || []) {
      await deleteImageByPublicId(image.imagePublicId);
    }
  }

  async listPublic() {
    const projects = await PortfolioProject.findAll({
      where: { active: true },
      include: this.getProjectInclude(),
      order: this.getProjectOrder(),
    });

    return projects.map((project) => project.get({ plain: true }));
  }

  async getBySlug(slug: string) {
    const project = await PortfolioProject.findOne({
      where: { slug, active: true },
      include: this.getProjectInclude(),
      order: [[{ model: PortfolioProjectImage, as: "galleryImages" }, "sortOrder", "ASC"]],
    });

    return project?.get({ plain: true }) || null;
  }

  async listAdmin(page = 1, limit = 12, search?: string) {
    const offset = (page - 1) * limit;
    const where: Record<string, unknown> & {
      [Op.or]?: Record<string, unknown>[];
    } = {};

    if (search?.trim()) {
      where[Op.or] = [
        { titleEn: { [Op.iLike]: `%${search.trim()}%` } },
        { titleAr: { [Op.iLike]: `%${search.trim()}%` } },
        { slug: { [Op.iLike]: `%${search.trim()}%` } },
      ];
    }

    const { count, rows } = await PortfolioProject.findAndCountAll({
      where,
      include: this.getProjectInclude(),
      order: this.getProjectOrder(),
      limit,
      offset,
      distinct: true,
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

  async getById(id: number) {
    const project = await PortfolioProject.findOne({
      where: { id },
      include: this.getProjectInclude(),
      order: [[{ model: PortfolioProjectImage, as: "galleryImages" }, "sortOrder", "ASC"]],
    });

    return project?.get({ plain: true }) || null;
  }

  async create(payload: PortfolioProjectPayload, options: PortfolioUpsertOptions = {}) {
    const transaction = await PortfolioProject.sequelize!.transaction();

    try {
      const slug = await this.ensureUniqueSlug(
        payload.slug || payload.titleEn || payload.titleAr
      );
      const project = await PortfolioProject.create(
        {
          ...payload,
          slug,
          active: payload.active ?? true,
          sortOrder: payload.sortOrder ?? 0,
          coverImageUrl: options.coverImage?.url || null,
          coverImagePublicId: options.coverImage?.publicId || null,
        },
        { transaction }
      );

      if ((options.newGalleryImages || []).length) {
        await PortfolioProjectImage.bulkCreate(
          (options.newGalleryImages || []).map((image, index) => ({
            projectId: project.id,
            imageUrl: image.url,
            imagePublicId: image.publicId,
            altEn: payload.titleEn,
            altAr: payload.titleAr,
            sortOrder: index,
          })),
          { transaction }
        );
      }

      await transaction.commit();
      return this.getById(project.id);
    } catch (error) {
      await transaction.rollback();
      await deleteImageByPublicId(options.coverImage?.publicId);
      for (const image of options.newGalleryImages || []) {
        await deleteImageByPublicId(image.publicId);
      }
      throw error;
    }
  }

  async update(
    id: number,
    payload: Partial<PortfolioProjectPayload>,
    options: PortfolioUpsertOptions = {}
  ) {
    const project = await PortfolioProject.findByPk(id, {
      include: this.getProjectInclude(),
    });

    if (!project) {
      return null;
    }

    const transaction = await PortfolioProject.sequelize!.transaction();

    try {
      const plain = project.get({ plain: true }) as PortfolioProject & {
        galleryImages?: PortfolioProjectImage[];
      };

      const updates: Record<string, unknown> = { ...payload };

      if (payload.slug) {
        updates.slug = await this.ensureUniqueSlug(payload.slug, id);
      }

      if (options.coverImage) {
        updates.coverImageUrl = options.coverImage.url;
        updates.coverImagePublicId = options.coverImage.publicId;
      } else if (options.removeCoverImage) {
        updates.coverImageUrl = null;
        updates.coverImagePublicId = null;
      }

      await project.update(updates, { transaction });

      for (const imageMeta of options.existingGallery || []) {
        if (!imageMeta.id) continue;
        await PortfolioProjectImage.update(
          {
            altEn: imageMeta.altEn ?? payload.titleEn ?? plain.titleEn,
            altAr: imageMeta.altAr ?? payload.titleAr ?? plain.titleAr,
            sortOrder: imageMeta.sortOrder ?? 0,
          },
          {
            where: { id: imageMeta.id, projectId: id },
            transaction,
          }
        );
      }

      if ((options.removeGalleryImageIds || []).length) {
        await PortfolioProjectImage.destroy({
          where: { id: options.removeGalleryImageIds, projectId: id },
          transaction,
        });
      }

      if ((options.newGalleryImages || []).length) {
        const currentMaxSort = Math.max(
          -1,
          ...(options.existingGallery || []).map((image) => image.sortOrder ?? 0)
        );
        await PortfolioProjectImage.bulkCreate(
          (options.newGalleryImages || []).map((image, index) => ({
            projectId: id,
            imageUrl: image.url,
            imagePublicId: image.publicId,
            altEn: payload.titleEn ?? plain.titleEn,
            altAr: payload.titleAr ?? plain.titleAr,
            sortOrder: currentMaxSort + index + 1,
          })),
          { transaction }
        );
      }

      await transaction.commit();

      if ((options.coverImage || options.removeCoverImage) && plain.coverImagePublicId) {
        await deleteImageByPublicId(plain.coverImagePublicId);
      }

      for (const image of plain.galleryImages || []) {
        if ((options.removeGalleryImageIds || []).includes(image.id)) {
          await deleteImageByPublicId(image.imagePublicId);
        }
      }

      return this.getById(id);
    } catch (error) {
      await transaction.rollback();
      await deleteImageByPublicId(options.coverImage?.publicId);
      for (const image of options.newGalleryImages || []) {
        await deleteImageByPublicId(image.publicId);
      }
      throw error;
    }
  }

  async delete(id: number) {
    const project = await PortfolioProject.findByPk(id, {
      include: this.getProjectInclude(),
    });
    if (!project) {
      return false;
    }

    const plain = project.get({ plain: true }) as PortfolioProject & {
      galleryImages?: PortfolioProjectImage[];
    };

    await project.destroy();
    await this.deleteProjectAssets(plain);
    return true;
  }
}

export const portfolioService = new PortfolioService();
