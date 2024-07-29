import { ROLE } from "../enums/role";

export interface IFile {
  filePath: string;
}

export interface IALLFile extends IFile {
  id: string;
  userId: string;
}

export interface IQueryFile extends IALLFile {
  role: ROLE
}
