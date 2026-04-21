import { NextFunction, Request, Response } from "express";
import { portfolioService } from "../services/portfolio.service";
import { uploadImageBuffer, UploadedFile } from "../utils/cloudinary";

const parseJson = <T>(value: unknown, fallback: T): T => {
  if (typeof value !== "string") return (value as T) ?? fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

class PortfolioController {
  listPublic = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await portfolioService.listPublic());
    } catch (error) {
      next(error);
    }
  };

  getPublicBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await portfolioService.getBySlug(req.params.slug);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      next(error);
    }
  };

  listAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt((req.query.page as string) || "1", 10);
      const limit = parseInt((req.query.limit as string) || "12", 10);
      const search = req.query.search as string | undefined;

      res.json(await portfolioService.listAdmin(page, limit, search));
    } catch (error) {
      next(error);
    }
  };

  getAdminById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await portfolioService.getById(Number(req.params.id));
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Record<string, Express.Multer.File[]> | undefined;
      const coverImageFile = files?.coverImage?.[0] as UploadedFile | undefined;
      const galleryFiles = (files?.galleryImages || []) as UploadedFile[];

      const coverImage = coverImageFile
        ? await uploadImageBuffer(coverImageFile, "portfolio/covers")
        : undefined;
      const galleryImages = await Promise.all(
        galleryFiles.map((file) => uploadImageBuffer(file, "portfolio/gallery"))
      );

      const project = await portfolioService.create(
        {
          slug: req.body.slug,
          titleEn: req.body.titleEn,
          titleAr: req.body.titleAr,
          summaryEn: req.body.summaryEn,
          summaryAr: req.body.summaryAr,
          descriptionEn: req.body.descriptionEn,
          descriptionAr: req.body.descriptionAr,
          active:
            req.body.active === undefined ? true : req.body.active === "true",
          sortOrder: req.body.sortOrder ? Number(req.body.sortOrder) : 0,
        },
        {
          coverImage,
          newGalleryImages: galleryImages,
        }
      );

      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Record<string, Express.Multer.File[]> | undefined;
      const coverImageFile = files?.coverImage?.[0] as UploadedFile | undefined;
      const galleryFiles = (files?.galleryImages || []) as UploadedFile[];

      const coverImage = coverImageFile
        ? await uploadImageBuffer(coverImageFile, "portfolio/covers")
        : undefined;
      const galleryImages = await Promise.all(
        galleryFiles.map((file) => uploadImageBuffer(file, "portfolio/gallery"))
      );

      const project = await portfolioService.update(
        Number(req.params.id),
        {
          slug: req.body.slug,
          titleEn: req.body.titleEn,
          titleAr: req.body.titleAr,
          summaryEn: req.body.summaryEn,
          summaryAr: req.body.summaryAr,
          descriptionEn: req.body.descriptionEn,
          descriptionAr: req.body.descriptionAr,
          active:
            req.body.active === undefined
              ? undefined
              : req.body.active === "true",
          sortOrder:
            req.body.sortOrder === undefined
              ? undefined
              : Number(req.body.sortOrder),
        },
        {
          coverImage,
          removeCoverImage: req.body.removeCoverImage === "true",
          existingGallery: parseJson(req.body.existingGallery, []),
          removeGalleryImageIds: parseJson(req.body.removeGalleryImageIds, []),
          newGalleryImages: galleryImages,
        }
      );

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await portfolioService.delete(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const portfolioController = new PortfolioController();
