import { NextFunction, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import config from "../config";
import * as authService from "../service/auth";
import loggerWithNameSpace from "../utils/logger";

import HttpStatusCodes from "http-status-codes";
const logger = loggerWithNameSpace("UserController");

/**
 * Controller function to handle user signup.
 * @param {Request} req - Express Request object containing user information in req.body.
 * @param {Response} res - Express Response object used to send JSON response.
 */
export async function signup(req: Request, res: Response) {
  const { body } = req;
  const { email, password, role } = body;
  if (role) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: "You cannot provide role",
    });
    return;
  }

  if (!email || !password) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: "All the required fields are not provided",
    });
    return;
  }
  const data = await authService.signup(body);
  if (data) {
    logger.info("Called signup");
    res.status(HttpStatusCodes.OK).json({
      message: "user created",
      ...body,
    });
  } else {
    res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: "User alredy exists",
    });
  }
}

/**
 * Controller function to handle user login.
 * @param {Request} req - Express Request object containing user credentials in req.body.
 * @param {Response} res - Express Response object used to send JSON response.
 * @param {next} next - Express nextfunction object
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { body } = req;
    console.log("controller" + body);
    const data = await authService.login(body);

    res.status(HttpStatusCodes.OK).json(data);
  } catch (e) {
    next(e);
  }
}

/**
 * Refreshes the access token using the provided refresh token.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export async function refresh(req: Request, res: Response) {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(HttpStatusCodes.NOT_FOUND).json({
      error: "Invalid token",
    });
    return;
  }

  const token = authorization.split(" ");

  if (token.length !== 2 || token[0] !== "Bearer") {
    res.status(HttpStatusCodes.NOT_FOUND).json({
      error: "Invalid method",
    });
    return;
  }

  verify(token[1], config.jwt.secret!, (error, data) => {
    if (error) {
      res.status(HttpStatusCodes.NOT_FOUND).json({
        error: error.message,
      });
    }

    if (typeof data !== "string" && data) {
      const payload = {
        id: data.id,
        name: data.name,
        email: data.email,
      };
      const accessToken = sign(payload, config.jwt.secret!);
      const refreshToken = token[1];
      logger.info("Called login");
      res.status(HttpStatusCodes.OK).json({
        accessToken,
        refreshToken,
      });
    }
  });
}
