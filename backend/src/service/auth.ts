import { default as bcript, default as bcrypt } from "bcrypt";
import { sign } from "jsonwebtoken";
import config from "../config";
import NotFoundError from "../error/NotFoundError";
import { User } from "../interfaces/user";
import * as UserModel from "../model/user";
import * as UserService from "../service/user";
import ConflictError from "../error/ConflictError";

export async function signup(user: User) {
  const password = await bcrypt.hash(user.password, 10);
  const existingUser = await UserModel.UserModel.getUserByEmail(user.email);
  if (existingUser) {
    throw new ConflictError('Email already exists in database');
  }
  const data = await UserService.createUser({ ...user, password });
  return data;
}

export async function login(body: Pick<User, "email" | "password">) {
  console.log('it comes in service')
  const existingUser = await UserModel.UserModel.getUserByEmail(body.email);
  console.log("service" + existingUser);
  if (!existingUser) {
    throw new NotFoundError("User not Exists");
  }
  const isValidPassword = await bcript.compare(
    body.password,
    existingUser.password
  );
  if (!isValidPassword) {
    throw new NotFoundError("Invalid email or  password");
  }

  const payload = {
    userId: existingUser.userId,
    name: existingUser.name,
    email: existingUser.email,
    role: existingUser.role,
  };
  const accessToken = await sign(payload, config.jwt.secret!, {
    expiresIn: config.jwt.acccessTokenExpiraryMS,
  });

  const refreshToken = await sign(payload, config.jwt.secret!, {
    expiresIn: config.jwt.refreshTokenExpiraryMS,
  });

  const name = existingUser.name;
  const roleId = existingUser.roleId;
  console.log(refreshToken)
  return {
    name,
    accessToken,
    refreshToken,
  };
}
