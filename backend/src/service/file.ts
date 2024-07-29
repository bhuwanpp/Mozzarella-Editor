import { ROLE } from "../enums/role";
import NotFoundError from "../error/NotFoundError";
import { IFile } from "../interfaces/file";
import * as FileModal from "../model/file";
/**
 * Retrieves all tasks for a specific user.
 * @param {string,ROLE } userId, role - The ID of the user whose tasks are to be retrieved.
 */
export function getFiles(userId: string, role: ROLE) {
  const data = FileModal.FileModal.getFiles(userId, role);
  return data;
}

/**
 * Retrieves a task by its ID for a specific user.
 * @param {string} id - The ID of the task to retrieve.
 * @param {string} userId - The ID of the user.
 */
export function getFileById(id: string, userId: string) {
  const data = FileModal.FileModal.getFileById(id, userId);
  if (!data) {
    throw new NotFoundError(`Todo with id: ${id} not found`);
  }
  return data;
}

/**
 * Creates a new task for a specific user.
 * @param {ITask} task - The task object to create.
 * @param {string} userId - The ID of the user for whom the task is created.
 */
export function createFile(filePath: IFile, userId: string) {
  FileModal.FileModal.createFile(filePath, userId);
}

/**
 * Updates an existing task for a specific user.
 * @param {string} id - The ID of the task to update.
 * @param {IFile} file - The updated task object.
 * @param {string} userId - The ID of the user.
 */
export async function updateFile(id: string, filePath: IFile, userId: string) {
  const data = await FileModal.FileModal.updateFile(id, filePath, userId);
  if (!data) {
    throw new NotFoundError(`Todo with id ${id} Not Found`);
  } else {
    return data;
  }
}

/**
 * Deletes a task by its ID for a specific user.
 * @param {string} id - The ID of the task to delete.
 * @param {string} userId - The ID of the user.
 */
export async function deleteFile(id: string, userId: string) {
  const data = await FileModal.FileModal.deleteFile(id, userId);
  if (data) {
    throw new NotFoundError(`Todo with id ${id} Not Found`);
  }
}
