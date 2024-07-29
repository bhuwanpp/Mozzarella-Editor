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
describe("file Integrarion test suite", () => {
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
  describe("getFile API Test", () => {
    it("Should return all file for admin user", async () => {
      const response = await request(app)
        .get("/file")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatusCodes.OK);
    });
  });

  // create tasks
  describe("createFile API Test", () => {
    it("Should create a new file for the user", async () => {
      const newFile = {
        file_path: "one.js",
      };

      const response = await request(app)
        .post("/file")
        .set("Authorization", `Bearer ${token}`)
        .send(newFile);

      expect(response.status).toBe(HttpStatusCodes.OK);
    });
  });
  // get tasks by id
  describe("getfileById API Test", () => {
    it("Should return the file with the specified ID for the user", async () => {
      const fileId = "1";

      const response = await request(app)
        .get(`/file/${fileId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatusCodes.OK);
    });
  });
  // Test for updateTask API
  describe("updateFile API Test", () => {
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
