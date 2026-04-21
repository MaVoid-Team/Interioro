import { NextFunction, Request, Response } from "express";
import { designRequestService } from "../services/designRequest.service";
import { uploadImageBuffer, UploadedFile } from "../utils/cloudinary";

const getUploadedImages = async (req: Request, folder: string) => {
  const files = ((req.files || []) as Express.Multer.File[]) as UploadedFile[];
  return Promise.all(files.map((file) => uploadImageBuffer(file, folder)));
};

class DesignRequestController {
  submitCustom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = await designRequestService.createCustomRequest(
        {
          userId: (req.user as { id?: number } | undefined)?.id ?? null,
          fullName: req.body.fullName,
          email: req.body.email,
          phone: req.body.phone,
          projectTypeOrSpace: req.body.projectTypeOrSpace,
          visionDescription: req.body.visionDescription,
          stylePreferences: req.body.stylePreferences,
          dimensions: req.body.dimensions,
          budget: req.body.budget,
          timeline: req.body.timeline,
        },
        await getUploadedImages(req, "design-services/custom")
      );

      res.status(201).json(request);
    } catch (error) {
      next(error);
    }
  };

  submitSpecialPiece = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = await designRequestService.createSpecialPieceRequest(
        {
          userId: (req.user as { id?: number } | undefined)?.id ?? null,
          fullName: req.body.fullName,
          email: req.body.email,
          phone: req.body.phone,
          desiredPieceType: req.body.desiredPieceType,
          visionDescription: req.body.visionDescription,
          dimensions: req.body.dimensions,
          budget: req.body.budget,
          timeline: req.body.timeline,
        },
        await getUploadedImages(req, "design-services/special-piece")
      );

      res.status(201).json(request);
    } catch (error) {
      next(error);
    }
  };

  submitConsultation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = await designRequestService.createConsultationRequest(
        {
          userId: (req.user as { id?: number } | undefined)?.id ?? null,
          fullName: req.body.fullName,
          email: req.body.email,
          phone: req.body.phone,
          preferredContactMethod: req.body.preferredContactMethod,
          questionSummary: req.body.questionSummary,
          preferredDays: req.body.preferredDays,
          preferredTimeWindow: req.body.preferredTimeWindow,
        },
        await getUploadedImages(req, "design-services/consultations")
      );

      res.status(201).json(request);
    } catch (error) {
      next(error);
    }
  };

  listCustom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await designRequestService.listCustomRequests({
          page: req.query.page ? Number(req.query.page) : 1,
          limit: req.query.limit ? Number(req.query.limit) : 12,
          status: req.query.status as "new" | "contacted" | "closed" | "all",
          search: req.query.search as string | undefined,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  getCustom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await designRequestService.getCustomRequest(Number(req.params.id));
      if (!item) {
        return res.status(404).json({ message: "Request not found" });
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  };

  updateCustom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await designRequestService.updateCustomRequest(
        Number(req.params.id),
        {
          status: req.body.status,
          internalNotes: req.body.internalNotes,
        }
      );
      if (!item) {
        return res.status(404).json({ message: "Request not found" });
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  };

  listSpecialPiece = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await designRequestService.listSpecialPieceRequests({
          page: req.query.page ? Number(req.query.page) : 1,
          limit: req.query.limit ? Number(req.query.limit) : 12,
          status: req.query.status as "new" | "contacted" | "closed" | "all",
          search: req.query.search as string | undefined,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  getSpecialPiece = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await designRequestService.getSpecialPieceRequest(
        Number(req.params.id)
      );
      if (!item) {
        return res.status(404).json({ message: "Request not found" });
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  };

  updateSpecialPiece = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await designRequestService.updateSpecialPieceRequest(
        Number(req.params.id),
        {
          status: req.body.status,
          internalNotes: req.body.internalNotes,
        }
      );
      if (!item) {
        return res.status(404).json({ message: "Request not found" });
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  };

  listConsultation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await designRequestService.listConsultationRequests({
          page: req.query.page ? Number(req.query.page) : 1,
          limit: req.query.limit ? Number(req.query.limit) : 12,
          status: req.query.status as "new" | "contacted" | "closed" | "all",
          search: req.query.search as string | undefined,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  getConsultation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await designRequestService.getConsultationRequest(
        Number(req.params.id)
      );
      if (!item) {
        return res.status(404).json({ message: "Request not found" });
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  };

  updateConsultation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await designRequestService.updateConsultationRequest(
        Number(req.params.id),
        {
          status: req.body.status,
          internalNotes: req.body.internalNotes,
        }
      );
      if (!item) {
        return res.status(404).json({ message: "Request not found" });
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  };
}

export const designRequestController = new DesignRequestController();
