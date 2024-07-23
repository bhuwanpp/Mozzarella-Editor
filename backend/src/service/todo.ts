import { ROLE } from "../enums/role";
import NotFoundError from "../error/NotFoundError";
import { ITask } from "../interfaces/todo";
import * as TasksModel from "../model/todo";
/**
 * Retrieves all tasks for a specific user.
 * @param {string,ROLE } userId, role - The ID of the user whose tasks are to be retrieved.
 */
export function getTasks(userId: string, role: ROLE) {
  const data = TasksModel.TasksModel.getTasks(userId, role);
  return data;
}

/**
 * Retrieves a task by its ID for a specific user.
 * @param {string} id - The ID of the task to retrieve.
 * @param {string} userId - The ID of the user.
 */
export function getTaskById(id: string, userId: string) {
  const data = TasksModel.TasksModel.getTaskById(id, userId);
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
export function createTask(task: ITask, userId: string) {
  TasksModel.TasksModel.createTask(task, userId);
}

/**
 * Updates an existing task for a specific user.
 * @param {string} id - The ID of the task to update.
 * @param {ITask} task - The updated task object.
 * @param {string} userId - The ID of the user.
 */
export async function updateTask(id: string, task: ITask, userId: string) {
  const data = await TasksModel.TasksModel.updateTask(id, task, userId);
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
export async function deleteTask(id: string, userId: string) {
  const data = await TasksModel.TasksModel.deleteTask(id, userId);
  if (data) {
    throw new NotFoundError(`Todo with id ${id} Not Found`);
  }
}
