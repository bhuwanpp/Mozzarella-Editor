import expect from "expect";
import { default as Sinon, default as sinon } from "sinon";
import { ROLE } from "../../../enums/role";
import NotFoundError from "../../../error/NotFoundError";
import { IALLFile, IFile } from "../../../interfaces/file";
import * as FileService from "../../../service/file";
import { FileModal } from "../../../model/file";

//  unit test for delete task
describe("Task service Test Suite", () => {
  //  unit test for getTasks
  describe("getTasks", () => {
    let taskModelGetTasksStub: sinon.SinonStub;

    beforeEach(() => {
      taskModelGetTasksStub = sinon.stub(FileModal, "getFiles");
    });

    afterEach(() => {
      Sinon.restore();
    });

    it("Should return tasks based on user ID and role", () => {
      const userId = "1";
      const userRole = ROLE.USER;
      const expectedTasks: IALLFile[] = [
        { id: "1", filePath: "Task 1", userId: "1" },
        { id: "2", filePath: "Task 2", userId: "1" },
      ];

      taskModelGetTasksStub.withArgs(userId, userRole).returns(expectedTasks);

      const result = FileService.getFiles(userId, userRole);

      expect(
        taskModelGetTasksStub.calledOnceWith(userId, userRole)
      ).toBeTruthy();
      expect(result).toEqual(expectedTasks);
    });

    it("Should return an empty array if no tasks found", () => {
      const userId = "2";
      const userRole = ROLE.ADMIN;

      taskModelGetTasksStub.withArgs(userId, userRole).returns([]);

      const result = FileService.getFiles(userId, userRole);

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
      taskModelGetTaskByIdStub = sinon.stub(FileModal, "getFileById");
    });

    afterEach(() => {
      sinon.restore();
      taskModelGetTaskByIdStub.restore();
    });

    it("Should throw an error if task is not found", () => {
      const fileId = "1";
      const userId = "2";
      taskModelGetTaskByIdStub.withArgs(fileId, userId).returns(undefined);
      expect(() => FileService.getFileById(fileId, userId)).toThrowError(
        new NotFoundError(`Todo with id: ${fileId} not found`)
      );
    });

    it("Should return the task if found", () => {
      const taskId = "1";
      const userId = "2";
      const task: IALLFile = {
        id: taskId,
        filePath: "Example task",
        userId: userId,
      };

      taskModelGetTaskByIdStub.withArgs(taskId, userId).returns(task);
      const result = FileService.getFileById(taskId, userId);
      expect(result).toEqual(task);
    });
  });

  //  unit test for create task
  describe("createTask", () => {
    let taskModelCreateTaskStub: sinon.SinonStub;
    beforeEach(() => {
      taskModelCreateTaskStub = sinon.stub(FileModal, "createFile");
    });

    afterEach(() => {
      sinon.restore();
    });

    it("Should create a new task", () => {
      const userId = "1";
      const newTask: IFile = {
        filePath: "Example task",
      };

      FileService.createFile(newTask, userId);
      expect(taskModelCreateTaskStub.callCount).toBe(1);
      expect(taskModelCreateTaskStub.getCall(0).args[0]).toStrictEqual(newTask);
    });
  });

  //  unit test for update task
  describe("updateTask", () => {
    let taskModelUpdateTaskStub: sinon.SinonStub;
    let taskModelGetTasksByIdStub: sinon.SinonStub;

    beforeEach(() => {
      taskModelGetTasksByIdStub = sinon.stub(FileModal, "getFileById");
      taskModelUpdateTaskStub = sinon.stub(FileModal, "updateFile");
    });

    afterEach(() => {
      sinon.restore();
      taskModelUpdateTaskStub.restore();
      taskModelGetTasksByIdStub.restore();
    });
    it("Should throw an error if task is not found", () => {
      const fileId = "5";
      const userId = "5";

      taskModelGetTasksByIdStub.withArgs(fileId, userId).returns(undefined);

      expect(() => FileService.getFileById(fileId, userId)).toThrowError(
        new NotFoundError(`Todo with id: ${fileId} not found`)
      );
    });

    it("should update an existing task", async () => {
      const fileId = "5";
      const userId = "5";
      const updateTaskData: IALLFile = {
        id: fileId,
        filePath: "Updated task",
        userId: userId,
      };
      const existingTask = { id: fileId, todo: "Old task", userId };

      taskModelGetTasksByIdStub.returns(existingTask);
      taskModelUpdateTaskStub.returns(updateTaskData);

      const result = FileService.updateFile(fileId, updateTaskData, userId);
      console.log(result);

      expect(result).toEqual(updateTaskData);
    });
  });

  // unit test for deleteTask
  describe("deleteFile", () => {
    let taskModelDeleteTaskStub: sinon.SinonStub;

    beforeEach(() => {
      taskModelDeleteTaskStub = sinon.stub(FileModal, "deleteFile");
    });

    afterEach(() => {
      sinon.restore();
    });

    it("Should delete an existing task", () => {
      const fileId = "1";
      const userId = "user1";

      taskModelDeleteTaskStub.withArgs(fileId, userId).returns(undefined);

      const result = FileService.deleteFile(fileId, userId);

      expect(taskModelDeleteTaskStub.calledOnce).toBeTruthy();
      expect(result).toBeUndefined();
    });

    it("Should throw NotFoundError when task is not found", () => {
      const fileId = "999";
      const userId = "user999";

      taskModelDeleteTaskStub.withArgs(fileId, userId).returns(-1);

      expect(() => FileService.deleteFile(fileId, userId)).toThrowError(
        new NotFoundError(`file with id ${fileId} Not Found`)
      );

      expect(taskModelDeleteTaskStub.calledOnce).toBeTruthy();
    });
  });
});
