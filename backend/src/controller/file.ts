import { NextFunction, Response } from "express";
import HttpStatusCodes from "http-status-codes";
import { Request } from "../interfaces/auth";
import * as fileService from "../service/file";
import loggerWithNameSpace from "../utils/logger";
const logger = loggerWithNameSpace("UserController");

/**
 * Retrieves all tasks.
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 */
export async function getFile(req: Request, res: Response) {
  const { userId, role } = req.user!;
  const data = await fileService.getFiles(userId, role);
  logger.info("Called getFile");
  res.status(HttpStatusCodes.OK).json({ data });
}

/**
 * Retrieves a task by its ID.
 * @param {Request} req - The Express Request object containing the task ID in req.params.
 * @param {Response} res - The Express Response object.
 *  @param {next} next - Express nextfunction object
 */
export async function getFileById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { userId } = req.user!;
    const data = await fileService.getFileById(id, userId);
    logger.info("Called getFielById");
    res.status(HttpStatusCodes.OK).json({ data });
  } catch (e) {
    next(e);
  }
}

/**
 * Creates a new task.
 * @param {Request} req - The Express Request object containing the task data in req.body.
 * @param {Response} res - The Express Response object.
 * @param {next} next - Express nextfunction object
 */
export function createFile(req: Request, res: Response, next: NextFunction) {
  try {
    const { body } = req;
    const { userId } = req.user!;
    fileService.createFile(body, userId);
    logger.info("Called createFile");
    res.status(HttpStatusCodes.OK).json({
      message: "task created ",
      ...body,
    });
  } catch (e) {
    next(e);
  }
}

/**
 * Updates an existing task.
 * @param {Request} req - The Express Request object containing the task ID in req.params and updated data in req.body.
 * @param {Response} res - The Express Response object.
 * @param {next} next - Express nextfunction object
 */
export async function updateFile(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { body } = req;
    const { userId } = req.user!;
    await fileService.updateFile(id, body, userId);
    logger.info("Called updateFile");
    res.status(HttpStatusCodes.OK).json({
      message: "task updated",
      ...body,
    });
  } catch (e) {
    next(e);
  }
}

/**
 * Deletes a task.
 * @param {Request} req - The Express Request object containing the task ID in req.params.
 * @param {Response} res - The Express Response object.
 * @param {next} next - Express nextfunction object
 */
export async function deleteFile(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { body } = req;
    const { userId } = req.user!;
    await fileService.deleteFile(id, userId);
    logger.info("Called deleteFile");
    res.status(HttpStatusCodes.OK).json({
      message: "task deleted",
      ...body,
    });
  } catch (e) {
    next(e);
  }
}
