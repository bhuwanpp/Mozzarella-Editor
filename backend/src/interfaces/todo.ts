import { ROLE } from "../enums/role";

export interface ITask {
  todo: string;
}

export interface IALLTasks extends ITask {
  id: string;
  userId: string;
}

export interface IQueryTask extends IALLTasks {
  role: ROLE
}
