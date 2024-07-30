import { NextFunction, Request, Response } from "express";
import HttpStatusCodes from "http-status-codes";
import { GetUserQuery, User } from "../interfaces/user";
import * as UserService from "../service/user";
import loggerWithNameSpace from "../utils/logger";
const logger = loggerWithNameSpace("UserController");
/**
 * Controller function to get users based on query parameters.
 * @param {Request<any, any, any, GetUserQuery>} req - Express Request object containing query parameters in req.query.
 * @param {Response} res - Express Response object used to send JSON response.
 */
export async function getUsers(
  req: Request<any, any, any, GetUserQuery>,
  res: Response
) {
  const { body } = req;
  const data = await UserService.getUsers(body);
  logger.info("Called getUsers");
  res.status(HttpStatusCodes.OK).json(data);
}

/**
 * Controller function to get user details by ID.
 * @param {Request} req - Express Request object containing user ID in req.params.
 * @param {Response} res - Express Response object used to send JSON response.
 * @param {next} next - Express nextfunction object
 */
export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    console.log(' controller userid' + id)
    const data = await UserService.getUserById(id);
    logger.info("Called getUserById");
    res.status(HttpStatusCodes.OK).json(data);
  } catch (e) {
    next(e);
  }
}
/**
 * Controller function to update user details by ID.
 * @param {Request} req - Express Request object containing user ID in req.params and updated user details in req.body.
 * @param {Response} res - Express Response object used to send JSON response.
 * @param {next} next - Express nextfunction object
 */
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
/**
 * Controller function to delete user by ID.
 * @param {Request} req - Express Request object containing user ID in req.params.
 * @param {Response} res - Express Response object used to send JSON response.
 * @param {next} next - Express nextfunction object
 * @returns {void} - Returns nothing directly but sends JSON response.
 */
export function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const { id } = req.params;

    const deleteResult = UserService.deleteUser(id);

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
    next(e);
  }
}
