import express from "express";
import {
  createFile,
  deleteFile,
  getFile,
  getFileById,
  updateFile,
} from "../controller/file";
import { ROLE } from "../enums/role";
import { auth, authorize } from "../middleware/auth";
import { validateReqBody, validateReqParams } from "../middleware/validator";
import { getCreateTaskSchema, paramSchema } from "../schema/file";

const router = express();
router.get("/", auth, authorize([ROLE.USER, ROLE.ADMIN]), getFile);
router.post("/", validateReqBody(getCreateTaskSchema), auth, createFile);
router.get("/:id", validateReqParams(paramSchema), auth, getFileById);
router.put(
  "/:id",
  validateReqParams(paramSchema),
  validateReqBody(getCreateTaskSchema),
  auth,
  updateFile
);
router.delete("/:id", validateReqParams(paramSchema), auth, deleteFile);

export default router;
