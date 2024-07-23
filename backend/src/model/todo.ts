import { ROLE } from "../enums/role";
import { IALLTasks, IQueryTask, ITask } from "../interfaces/todo";
import { BaseModel } from "./base";

export class TasksModel extends BaseModel {
  static async create(task: IALLTasks) {
    const todoToCreate = {
      todo: task.todo,
      userId: task.userId,
    };
    await this.queryBuilder().insert(todoToCreate).table("todos");
  }
  static async update(id: string, task: ITask) {
    const taskToUpdate = {
      name: task.todo,
      updatedAt: new Date(),
    };
    const query = this.queryBuilder()
      .update(taskToUpdate)
      .table("todos")
      .where({ id });
    await query;
  }
  // static getTasks(userId: string, role: ROLE | ROLE[]) {
  //   if (role === ROLE.ADMIN) {
  //     this.queryBuilder().select("*").from("todos")
  //   } else {
  //     return this.queryBuilder().select("*").from("todos").where({ userId });
  //
  //   }
  // }
  static getTasks(userId: string, role: string) {
    console.log(userId, role)
    const query = this.queryBuilder().select("*").from("todos").where({ userId });
    return query;
  }

  static getTaskById(id: string, userId: string) {
    const query = this.queryBuilder()
      .select("*")
      .from("todos")
      .where({ id, userId })
      .first();
    return query;
  }
  static createTask(task: ITask, userId: string) {
    const newTask = {
      ...task,
      userId,
    };
    const query = this.queryBuilder().insert(newTask).into("todos");
    return query;
  }
  static async updateTask(id: string, task: ITask, userId: string) {
    const updatedTask = {
      ...task,
      updatedAt: new Date(),
    };
    const result = this.queryBuilder()
      .update(updatedTask)
      .where({ id, userId })
      .into("todos");
    return await result;
  }
  static async deleteTask(id: string, userId: string) {
    const result = this.queryBuilder()
      .delete()
      .from("todos")
      .where({ id, userId });
    return await result;
  }
}
