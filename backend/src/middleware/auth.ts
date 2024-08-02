import { NextFunction, Response } from "express";
import jwt, { verify } from "jsonwebtoken";
import config from "../config";
import { ROLE } from "../enums/role";
import { UnauthenticatedError } from "../error/UnauthenticateError";
import { UnauthorizeError } from "../error/UnauthorizedError";
import { Request } from "../interfaces/auth";
import { User } from "../interfaces/user";
import { getUserById } from "../service/user";
import { ApiResponse } from "../utils/apiResponse";

export function auth(req: Request, res: Response, next: NextFunction): void {
  const { authorization } = req.headers;

  if (!authorization) {
    next(new UnauthenticatedError("Token not found"));
    return;
  }
  // Split the token and check format
  const token = authorization.split(" ");
  if (token.length !== 2 || token[0] !== "Bearer") {
    next(new UnauthenticatedError("Unauthenticated"));
    return;
  }
  // verify is checking it expire or not
  try {
    const user = verify(token[1], config.jwt.secret!) as User;
    req.user = user;
  } catch (error) {
    next(new UnauthenticatedError("Unauthenticated"));
  }
  next();
}

export function authorize(role: ROLE | ROLE[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    try {
      if (typeof role == "string") {
        if (!user?.role.includes(role)) {
          next(new UnauthorizeError("User is not authorized"));
        }
      } else if (typeof role == "object") {
        const permit = role.findIndex((p) => user?.role.includes(p));
        if (permit == -1) {
          next(new UnauthorizeError("Unauthorized"));
        }
      }
    } catch (error) {
      next(new UnauthorizeError("Permission failed"));
    }
    next();
  };
}

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("it comes here");
  const { authorization } = req.headers;
  if (!authorization) {
    next(new UnauthenticatedError("Access token required"));
    return;
  }
  const token = authorization.split(" ");
  if (token.length !== 2 || token[0] !== "Bearer") {
    next(new UnauthenticatedError("Invalid access token"));
    return;
  }
  try {
    console.log("it comes in try block");
    const playload = jwt.verify(token[1], config.jwt.secret!) as User;

    const user = await getUserById(playload.userId);
    // Check if the user’s role is admin
    if (user.role.includes(ROLE.ADMIN)) {
      res.status(200).json(new ApiResponse("Verified", user));
    } else {
      next(new UnauthenticatedError("User is not authorized"));
    }
  } catch (error) {
    next(new UnauthenticatedError("Invalid access token"));
    return;
  }
};
