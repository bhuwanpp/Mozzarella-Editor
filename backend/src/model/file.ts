import fs from 'fs/promises';
import path from 'path';

interface IFile {
  fileName: string;
  fileData: string;
}

export class FileModal {
  private static getFilesDir(userId: string): string {
    return path.join(__dirname, `../code/${userId}`);
  }

  static async createFile(fileName: string, userId: string, fileData: string) {
    const FILES_DIR = this.getFilesDir(userId);

    // Ensure files directory exists
    try {
      await fs.access(FILES_DIR);
    } catch {
      // Directory does not exist, create it recursively
      await fs.mkdir(FILES_DIR, { recursive: true });
    }

    const filePath = path.join(FILES_DIR, fileName);
    await fs.writeFile(filePath, fileData);
  }

  static async getFiles(userId: string): Promise<IFile[]> {
    const FILES_DIR = this.getFilesDir(userId);

    try {
      await fs.access(FILES_DIR);
      console.log('it comes in try', FILES_DIR)
    } catch {
      // If the directory doesn't exist, return an empty array
      return [];
    }

    const fileNames = await fs.readdir(FILES_DIR);
    const files: IFile[] = [];

    for (const fileName of fileNames) {
      if (fileName.endsWith('.js')) {
        const filePath = path.join(FILES_DIR, fileName);
        const fileData = await fs.readFile(filePath, 'utf-8');
        files.push({ fileName, fileData });
      }
    }
    console.log(files)

    return files;
  }

  static async deleteFile(fileName: string, userId: string): Promise<void> {
    const FILES_DIR = this.getFilesDir(userId);
    const filePath = path.join(FILES_DIR, fileName);

    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error('File not found');
      }
      throw error;
    }
  }
  static async renameFile(oldFileName: string, newFileName: string, userId: string): Promise<void> {
    const FILES_DIR = this.getFilesDir(userId);
    const oldFilePath = path.join(FILES_DIR, oldFileName);
    const newFilePath = path.join(FILES_DIR, newFileName);

    try {
      // Check if the old file exists
      await fs.access(oldFilePath);

      // Check if the new file name already exists
      try {
        await fs.access(newFilePath);
        throw new Error('A file with the new name already exists');
      } catch (error) {
        // If the new file doesn't exist, proceed with renaming
        if (error.code === 'ENOENT') {
          await fs.rename(oldFilePath, newFilePath);
        } else {
          throw error;
        }
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error('File not found');
      }
      throw error;
    }
  }
}

