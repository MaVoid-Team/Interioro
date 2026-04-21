import passport from "passport";
import { Request, Response, NextFunction } from "express";
import ac from "../config/roles";

// 1. Authentication Middleware (Checks if Token is valid)
export const authenticate = passport.authenticate("jwt", { session: false });

export const attachUserIfAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: unknown, user: unknown) => {
      if (!err && user) {
        req.user = user as Express.User;
      }
      next();
    }
  )(req, res, next);
};

// 2. Authorization Middleware (Checks if User has permission)
export const authorize = (action: string, resource: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as any; // Passport attaches this

      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const permission = (ac.can(user.role) as any)[action](resource);

      if (!permission.granted) {
        return res
          .status(403)
          .json({ message: "Forbidden: You do not have enough permissions" });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
