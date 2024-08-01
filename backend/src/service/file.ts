import NotFoundError from "../error/NotFoundError";
import * as FileModal from "../model/file";

export function getFiles(userId: string) {
  const data = FileModal.FileModal.getFiles(userId);
  return data;
}

export function createFile(fileName: string, userId: string, fileData: string) {
  FileModal.FileModal.createFile(fileName, userId, fileData);
}


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
