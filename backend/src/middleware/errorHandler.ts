import { NextFunction, Response } from "express";
import { Request } from "../interfaces/auth";
import HttpsStatusCode from "http-status-codes";
import { UnauthenticatedError } from "../error/UnauthenticateError";
import loggerWithNameSpace from "../utils/logger";
import NotFoundError from "../error/NotFoundError";
import ConflictError from "../error/ConflictError";
import { UnauthorizeError } from "../error/UnauthorizedError";
import { BadRequestError } from "../error/BadRequestError";
const logger = loggerWithNameSpace("ErrorHandler");
export function notFoundError(req: Request, res: Response) {
  return res.status(HttpsStatusCode.NOT_FOUND).json({
    message: "not found",
  });
}

export function genericErrorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error.stack) {
    logger.error(error.stack);
  }
  if (error instanceof UnauthenticatedError) {
    return res.status(HttpsStatusCode.UNAUTHORIZED).json({
      message: error.message,
    });
  }
  // put extra features in here
  if (error instanceof NotFoundError) {
    return res.status(HttpsStatusCode.NOT_FOUND).json({
      message: error.message,
    });
  }
  if (error instanceof ConflictError) {
    return res.status(HttpsStatusCode.CONFLICT).json({
      message: error.message,
    });
  }
  if (error instanceof UnauthorizeError) {
    return res.status(HttpsStatusCode.UNAUTHORIZED).json({
      message: error.message,
    });
  }
  if (error instanceof BadRequestError) {
    return res.status(HttpsStatusCode.BAD_REQUEST).json({
      message: error.message,
    });
  }
  return res.status(HttpsStatusCode.INTERNAL_SERVER_ERROR).json({
    message: "Internal server Error",
    stack: error.stack,
  });
}
