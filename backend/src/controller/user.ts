import { NextFunction, Request, Response } from "express";
import HttpStatusCodes from "http-status-codes";
import { GetUserQuery } from "../interfaces/user";
import * as UserService from "../service/user";
import loggerWithNameSpace from "../utils/logger";
import { ForbiddenError } from "../error/ForbiddenError";
const logger = loggerWithNameSpace("UserController");

export async function getUsers(
  req: Request<any, any, any, GetUserQuery>,
  res: Response
) {
  const query = req.query;
  const data = await UserService.getUsers(query);
  logger.info("Called getUsers");
  res.status(HttpStatusCodes.OK).json(data);
}

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const data = await UserService.getUserById(id);
    logger.info("Called getUserById");
    res.status(HttpStatusCodes.OK).json(data);
  } catch (e) {
    next(e);
  }
}

export async function updaePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, oldPassword, newPassword } = req.body;
    await UserService.updatePassword(email, oldPassword, newPassword);
    res.status(HttpStatusCodes.OK).json("Update user password successful");
    logger.info("Called update user password");
  } catch (e) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: e.message });
    next(e);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const deleteResult = await UserService.deleteUser(id);

    if (deleteResult) {
      res
        .status(HttpStatusCodes.OK)
        .json({ message: `User with id ${id} has been deleted` });
      logger.info("Called delete user");
    } else {
      res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ error: `User with id ${id} not found` });
    }
  } catch (e) {
    if (e instanceof ForbiddenError) {
      res.status(HttpStatusCodes.FORBIDDEN).json({ error: e.message });
    } else {
      next(e);
    }
  }
}
