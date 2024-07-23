import express from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTaskById,
  updateTask,
} from "../controller/todo";
import { ROLE } from "../enums/role";
import { auth, authorize } from "../middleware/auth";
import { validateReqBody, validateReqParams } from "../middleware/validator";
import { getCreateTaskSchema, paramSchema } from "../schema/todo";

const router = express();
router.get("/", auth, authorize([ROLE.USER, ROLE.ADMIN]), getTask);
router.post("/", validateReqBody(getCreateTaskSchema), auth, createTask);
router.get("/:id", validateReqParams(paramSchema), auth, getTaskById);
router.put(
  "/:id",
  validateReqParams(paramSchema),
  validateReqBody(getCreateTaskSchema),
  auth,
  updateTask
);
router.delete("/:id", validateReqParams(paramSchema), auth, deleteTask);

export default router;
