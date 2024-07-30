import { ROLE } from "../enums/role";
import NotFoundError from "../error/NotFoundError";
import { IFile } from "../interfaces/file";
import * as FileModal from "../model/file";
/**
 * Retrieves all tasks for a specific user.
 * @param {string,ROLE } userId, role - The ID of the user whose tasks are to be retrieved.
 */
export function getFiles(userId: string) {
  const data = FileModal.FileModal.getFiles(userId);
  return data;
}

/**
 * Retrieves a task by its ID for a specific user.
 * @param {string} id - The ID of the task to retrieve.
 * @param {string} userId - The ID of the user.
 */
// export function getFileById(id: string, userId: string) {
//   const data = FileModal.FileModal.getFileById(id, userId);
//   if (!data) {
//     throw new NotFoundError(`Todo with id: ${id} not found`);
//   }
//   return data;
// }

/**
 * Creates a new task for a specific user.
 * @param {ITask} task - The task object to create.
 * @param {string} userId - The ID of the user for whom the task is created.
 */
export function createFile(fileName: string, userId: string, fileData: string) {
  FileModal.FileModal.createFile(fileName, userId, fileData);
}

/**
 * Updates an existing task for a specific user.
 * @param {string} id - The ID of the task to update.
 * @param {IFile} file - The updated task object.
 * @param {string} userId - The ID of the user.
 */
export async function updateFile(oldFileName: string, newFileName: string, userId: string) {
  try {
    await FileModal.FileModal.renameFile(oldFileName, newFileName, userId);
    return { oldFileName, newFileName };
  } catch (error) {
    if (error.message === 'File not found') {
      throw new NotFoundError(`File ${oldFileName} not found`);
    } else if (error.message === 'A file with the new name already exists') {
      throw new Error(`A file named ${newFileName} already exists`);
    } else {
      throw error;
    }
  }
}

//
/**
 * Deletes a task by its ID for a specific user.
 * @param {string} id - The ID of the task to delete.
 * @param {string} userId - The ID of the user.
 */
export async function deleteFile(fileName: string, userId: string) {
  try {
    await FileModal.FileModal.deleteFile(fileName, userId);
  } catch (error) {
    if (error.message === 'File not found') {
      throw new NotFoundError(`File with name ${fileName} not found`);
    }
    throw error;
  }

}
