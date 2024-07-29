import { IALLFile, IFile } from "../interfaces/file";
import { BaseModel } from "./base";

export class FileModal extends BaseModel {
  static async create(file: IALLFile) {
    const fileToCreate = {
      filePath: file.filePath,
      userId: file.userId,
    };
    await this.queryBuilder().insert(fileToCreate).table("file");
  }
  static async update(id: string, file: IFile) {
    const fileToUpdate = {
      name: file.filePath,
      updatedAt: new Date(),
    };
    const query = this.queryBuilder()
      .update(fileToUpdate)
      .table("file")
      .where({ id });
    await query;
  }

  static getFiles(userId: string, role: string) {
    console.log(userId, role);
    const query = this.queryBuilder()
      .select("*")
      .from("file")
      .where({ userId });
    return query;
  }

  static getFileById(id: string, userId: string) {
    const query = this.queryBuilder()
      .select("*")
      .from("file")
      .where({ id, userId })
      .first();
    return query;
  }
  static createFile(file: IFile, userId: string) {
    const newFile = {
      ...file,
      userId,
    };
    const query = this.queryBuilder().insert(newFile).into("file");
    return query;
  }
  static async updateFile(id: string, file: IFile, userId: string) {
    const updatedFile = {
      ...file,
      updatedAt: new Date(),
    };
    const result = this.queryBuilder()
      .update(updatedFile)
      .where({ id, userId })
      .into("file");
    return await result;
  }
  static async deleteFile(id: string, userId: string) {
    const result = this.queryBuilder()
      .delete()
      .from("file")
      .where({ id, userId });
    return await result;
  }
}
