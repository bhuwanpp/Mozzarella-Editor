import { hash } from "bcrypt";
import ConflictError from "../error/ConflictError";
import NotFoundError from "../error/NotFoundError";
import { GetUserQuery, GetUserQueryPage, User } from "../interfaces/user";
import * as UserModel from "../model/user";

/**
 * Creates a new user.
 * @param {User} user - The user object containing user information.
 */
export function createUser(user: User) {
  return UserModel.UserModel.createUser(user);
}

/**
 * Retrieves users based on the provided query.
 * If no query is provided, retrieves all users.
 * @param {GetUserQuery} query - The query object containing search parameters.
 * @returns {User[]} - Array of users that match the query or all users if no query is provided.
 */
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

/**
 * Retrieves a user by their email address.
 * @param {string} email - The email address of the user to retrieve.
 * @returns {User | undefined} - The user object if found, undefined otherwise.
 */
export function getUserByEmail(email: string) {
  const data = UserModel.UserModel.getUserByEmail(email);
  return data;
}

/**
 * Retrieves a user by their ID.
 * @param {string} id - The ID of the user to retrieve.
 * @returns {User | { error: string }} - The user object if found, or an error object if user is not found.
 */
export function getUserById(id: string) {
  const data = UserModel.UserModel.getUserById(id);
  if (!data) {
    throw new NotFoundError(`User with id ${id} does not exist`);
  }
  return data;
}
/**
 * Updates an existing user's details.
 * @param {string} id - The ID of the user to update.
 * @param {Partial<User>} updatedUser - The updated user object containing new details.
 */
export async function updateUser(id: string, updatedUser: Partial<User>) {
  const existingUser = UserModel.UserModel.getUserById(id);
  if (!existingUser) {
    throw new NotFoundError(`User with id ${id} does not exist`);
  }

  if (updatedUser.password) {
    updatedUser.password = await hash(updatedUser.password, 10);
  }

  // Update user object with new details
  const updatedUserData = await {
    ...existingUser,
    ...updatedUser,
  };

  // Call the model function to update user
  const updated = UserModel.UserModel.updateUser(id, updatedUserData);

  if (!updated) {
    throw new ConflictError(`User ${id} doesnot match `);
  }

  return updated;
}
/**
 * Deletes a user by their ID.
 * @param {string} id - The ID of the user to delete.
 * @returns {boolean} - True if user is successfully deleted, false otherwise.
 */
export function deleteUser(id: string) {
  const existingUser = UserModel.UserModel.getUserById(id);
  if (!existingUser) {
    throw new NotFoundError(`User with id ${id} does not exist`);
  }

  // Call the model function to delete user
  const deleted = UserModel.UserModel.deleteUser(id);

  return deleted;
}
