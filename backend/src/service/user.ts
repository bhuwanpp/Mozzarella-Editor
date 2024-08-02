import bcrypt from "bcrypt";
import NotFoundError from "../error/NotFoundError";
import { UnauthorizeError } from "../error/UnauthorizedError";
import { GetUserQueryPage, User } from "../interfaces/user";
import * as UserModel from "../model/user";
import ConflictError from "../error/ConflictError";
import { ForbiddenError } from "../error/ForbiddenError";

export function createUser(user: User) {
  return UserModel.UserModel.createUser(user);
}

export async function getUsers(query: GetUserQueryPage) {
  const data = await UserModel.UserModel.getUsers(query);
  // this come as object
  const count = await UserModel.UserModel.count(query);
  const meta = {
    page: query.page,
    size: data.length,
    total: +count.count,
  };
  return { data, meta };
}

export function getUserById(id: string) {
  const data = UserModel.UserModel.getUserById(id);
  if (!data) {
    throw new NotFoundError(`User with id ${id} does not exist`);
  }
  return data;
}
export async function getUserByEmail(email: string) {
  const data = await UserModel.UserModel.getUserByEmail(email);
  if (data) {
    throw new ConflictError(`Email alredy exist in database`);
  }
  return data
}

export async function updatePassword(
  email: string,
  oldPassword: string,
  newPassword: string
) {
  const user = await UserModel.UserModel.getUserByEmail(email);
  if (!user) {
    throw new NotFoundError(`User with id ${user} does not exist`);
  }
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizeError("Invalid old password");
  }
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await UserModel.UserModel.updateUser(email, hashedNewPassword);
}

export async function deleteUser(id: string) {
  const existingUser = await UserModel.UserModel.getUserById(id);
  if (!existingUser) {
    throw new NotFoundError(`User with id ${id} does not exist`);
  }
  try {
    const deleted = await UserModel.UserModel.deleteUser(id);
    return deleted;
  } catch (error) {
    if (error.message === 'Cannot delete an admin user') {
      throw new ForbiddenError('Cannot delete an admin user');
    }
    throw error;
  }

}
