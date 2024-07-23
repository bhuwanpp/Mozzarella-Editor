import expect from "expect";
import { default as Sinon, default as sinon } from "sinon";
import { ROLE } from "../../../enums/role";
import NotFoundError from "../../../error/NotFoundError";
import { IALLTasks, ITask } from "../../../interfaces/todo";
// import * as TaskModel from "../../../model/todo";
import * as TaskService from "../../../service/todo";
import { TasksModel } from "../../../model/todo";

//  unit test for delete task
describe("Task service Test Suite", () => {
  //  unit test for getTasks
  describe("getTasks", () => {
    let taskModelGetTasksStub: sinon.SinonStub;

    beforeEach(() => {
      taskModelGetTasksStub = sinon.stub(TasksModel, "getTasks");
    });

    afterEach(() => {
      Sinon.restore();
    });

    it("Should return tasks based on user ID and role", () => {
      const userId = "1";
      const userRole = ROLE.USER;
      const expectedTasks: IALLTasks[] = [
        { id: "1", todo: "Task 1", userId: "1" },
        { id: "2", todo: "Task 2", userId: "1" },
      ];

      taskModelGetTasksStub.withArgs(userId, userRole).returns(expectedTasks);

      const result = TaskService.getTasks(userId, userRole);

      expect(
        taskModelGetTasksStub.calledOnceWith(userId, userRole)
      ).toBeTruthy();
      expect(result).toEqual(expectedTasks);
    });

    it("Should return an empty array if no tasks found", () => {
      const userId = "2";
      const userRole = ROLE.ADMIN;

      taskModelGetTasksStub.withArgs(userId, userRole).returns([]);

      const result = TaskService.getTasks(userId, userRole);

      expect(
        taskModelGetTasksStub.calledOnceWith(userId, userRole)
      ).toBeTruthy();
      expect(result).toEqual([]);
    });
  });

  //  unit test for gettasks by id
  describe("getTaskById", () => {
    let taskModelGetTaskByIdStub: sinon.SinonStub;

    beforeEach(() => {
      taskModelGetTaskByIdStub = sinon.stub(TasksModel, "getTaskById");
    });

    afterEach(() => {
      sinon.restore();
      taskModelGetTaskByIdStub.restore();
    });

    it("Should throw an error if task is not found", () => {
      const taskId = "1";
      const userId = "2";
      taskModelGetTaskByIdStub.withArgs(taskId, userId).returns(undefined);
      expect(() => TaskService.getTaskById(taskId, userId)).toThrowError(
        new NotFoundError(`Todo with id: ${taskId} not found`)
      );
    });

    it("Should return the task if found", () => {
      const taskId = "1";
      const userId = "2";
      const task: IALLTasks = {
        id: taskId,
        todo: "Example task",
        userId: userId,
      };

      taskModelGetTaskByIdStub.withArgs(taskId, userId).returns(task);
      const result = TaskService.getTaskById(taskId, userId);
      expect(result).toEqual(task);
    });
  });

  //  unit test for create task
  describe("createTask", () => {
    let taskModelCreateTaskStub: sinon.SinonStub;
    beforeEach(() => {
      taskModelCreateTaskStub = sinon.stub(TasksModel, "createTask");
    });

    afterEach(() => {
      sinon.restore();
    });

    it("Should create a new task", () => {
      const userId = "1";
      const newTask: ITask = {
        todo: "Example task",
      };

      TaskService.createTask(newTask, userId);
      expect(taskModelCreateTaskStub.callCount).toBe(1);
      expect(taskModelCreateTaskStub.getCall(0).args[0]).toStrictEqual(newTask);
    });
  });

  //  unit test for update task
  describe("updateTask", () => {
    let taskModelUpdateTaskStub: sinon.SinonStub;
    let taskModelGetTasksByIdStub: sinon.SinonStub;

    beforeEach(() => {
      taskModelGetTasksByIdStub = sinon.stub(TasksModel, "getTaskById");
      taskModelUpdateTaskStub = sinon.stub(TasksModel, "updateTask");
    });

    afterEach(() => {
      sinon.restore();
      taskModelUpdateTaskStub.restore();
      taskModelGetTasksByIdStub.restore();
    });
    it("Should throw an error if task is not found", () => {
      const taskId = "5";
      const userId = "5";

      taskModelGetTasksByIdStub.withArgs(taskId, userId).returns(undefined);

      expect(() => TaskService.getTaskById(taskId, userId)).toThrowError(
        new NotFoundError(`Todo with id: ${taskId} not found`)
      );
    });

    it("should update an existing task", async () => {
      const taskId = "5";
      const userId = "5";
      const updateTaskData: IALLTasks = {
        id: taskId,
        todo: "Updated task",
        userId: userId,
      };
      const existingTask = { id: taskId, todo: "Old task", userId };

      taskModelGetTasksByIdStub.returns(existingTask);
      taskModelUpdateTaskStub.returns(updateTaskData);

      const result = TaskService.updateTask(taskId, updateTaskData, userId);
      console.log(result);

      expect(result).toEqual(updateTaskData);
    });
  });

  // unit test for deleteTask
  describe("deleteTask", () => {
    let taskModelDeleteTaskStub: sinon.SinonStub;

    beforeEach(() => {
      taskModelDeleteTaskStub = sinon.stub(TasksModel, "deleteTask");
    });

    afterEach(() => {
      sinon.restore();
    });

    it("Should delete an existing task", () => {
      const taskId = "1";
      const userId = "user1";

      taskModelDeleteTaskStub.withArgs(taskId, userId).returns(undefined);

      const result = TaskService.deleteTask(taskId, userId);

      expect(taskModelDeleteTaskStub.calledOnce).toBeTruthy();
      expect(result).toBeUndefined();
    });

    it("Should throw NotFoundError when task is not found", () => {
      const taskId = "999";
      const userId = "user999";

      taskModelDeleteTaskStub.withArgs(taskId, userId).returns(-1);

      expect(() => TaskService.deleteTask(taskId, userId)).toThrowError(
        new NotFoundError(`Todo with id ${taskId} Not Found`)
      );

      expect(taskModelDeleteTaskStub.calledOnce).toBeTruthy();
    });
  });
});
