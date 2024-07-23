import expect from "expect";
import express from "express";
import HttpStatusCodes from "http-status-codes";
import { sign } from "jsonwebtoken";
import request from "supertest";
import config from "../../config";
import { ROLE } from "../../enums/role";
import { genericErrorHandler } from "../../middleware/errorHandler";
import router from "../../routes";
import { UserWithoutPassword } from "../../types/user";
const generateToken = (payload: UserWithoutPassword) => {
  return sign(payload, config.jwt.secret!, { expiresIn: "1h" });
};
describe("Todo Integrarion test suite", () => {
  const tokenPayload = {
    userId: "2",
    name: "user2",
    email: "two@gmail.com",
    password: "test123",
    role: ROLE.USER,
  };
  const token = generateToken(tokenPayload);
  const app = express();
  app.use(express.json());
  app.use(router);
  app.use(genericErrorHandler);

  // get tasks
  describe("getTask API Test", () => {
    it("Should return all tasks for admin user", async () => {
      const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatusCodes.OK);
    });
  });

  // create tasks
  describe("createTask API Test", () => {
    it("Should create a new task for the user", async () => {
      const newTask = {
        todo: "New Task",
      };

      const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send(newTask);

      expect(response.status).toBe(HttpStatusCodes.OK);
    });
  });
  // get tasks by id
  describe("getTaskById API Test", () => {
    it("Should return the task with the specified ID for the user", async () => {
      const taskId = "1";

      const response = await request(app)
        .get(`/tasks/${taskId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatusCodes.OK);
    });
  });
  // Test for updateTask API
  describe("updateTask API Test", () => {
    it("Should update the task with the specified ID for the user", async () => {
      const taskIdToUpdate = "3";
      const updatedTask = {
        todo: "Updated Task Title",
      };

      const response = await request(app)
        .put(`/tasks/${taskIdToUpdate}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedTask);
      console.log(response)
      expect(response.status).toBe(HttpStatusCodes.OK);
    });
  });
  // Test for delete API
  describe("deleteTask API Test", () => {
    it("Should delete the task with the specified ID for the user", async () => {
      const taskIdToDelete = "1";

      const response = await request(app)
        .delete(`/tasks/${taskIdToDelete}`)
        .set("Authorization", `Bearer ${token}`);


      expect(response.status).toBe(HttpStatusCodes.OK);
    });
  });
});
