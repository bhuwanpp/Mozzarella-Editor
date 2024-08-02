import { NextFunction, Response } from "express";
import HttpStatusCodes from "http-status-codes";
import { Request } from "../interfaces/auth";
import * as fileService from "../service/file";
import loggerWithNameSpace from "../utils/logger";
const logger = loggerWithNameSpace("UserController");

export async function getFile(req: Request, res: Response) {
  const { userId } = req.user!;
  const data = await fileService.getFiles(userId);
  logger.info("Called getFile");
  res.status(HttpStatusCodes.OK).json({ data });
}
export async function getUserFile(req: Request, res: Response) {
  const { userId } = req.params!;
  const data = await fileService.getFiles(userId);
  logger.info("Called getFile");
  res.status(HttpStatusCodes.OK).json({ data });
}

export function createFile(req: Request, res: Response, next: NextFunction) {
  try {
    const { body } = req;
    const { userId } = req.user!;

    fileService.createFile(body.fileName, userId, body.fileData);
    logger.info("Called createFile");
    res.status(HttpStatusCodes.OK).json({
      message: "task created ",
      ...body,
    });
  } catch (e) {
    next(e);
  }
}

export async function renameFile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { oldFileName, newFileName } = req.body;
    const { userId } = req.user!;
    await fileService.updateFile(oldFileName, newFileName, userId);
    logger.info(`File renamed from ${oldFileName} to ${newFileName}`);

    res.status(HttpStatusCodes.OK).json({
      message: "task updated",
      oldFileName,
      newFileName,
    });
  } catch (e) {
    next(e);
  }
}

export async function deleteFile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { fileName } = req.params;
    const { userId } = req.user!;
    await fileService.deleteFile(fileName, userId);
    logger.info("Called deleteFile");
    res.status(HttpStatusCodes.OK).json({
      message: "task deleted",
    });
  } catch (e) {
    next(e);
  }
}
