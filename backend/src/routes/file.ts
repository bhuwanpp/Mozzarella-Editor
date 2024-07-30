import express from "express";
import {
  createFile,
  deleteFile,
  getFile,
  renameFile,

} from "../controller/file";
import { ROLE } from "../enums/role";
import { auth, authorize } from "../middleware/auth";
import { validateReqBody, validateReqParams } from "../middleware/validator";
import { getCreateTaskSchema, paramSchema } from "../schema/file";

const router = express();
// router.get("/", auth, authorize([ROLE.USER, ROLE.ADMIN]), getFile);
// router.post("/", validateReqBody(getCreateTaskSchema), auth, createFile);
// router.get("/:id", validateReqParams(paramSchema), auth, getFileById);
// router.put(
//   "/:id",
//   validateReqParams(paramSchema),
//   validateReqBody(getCreateTaskSchema),
//   auth,
//   updateFile
// );
// router.delete("/:fileName", validateReqParams(paramSchema), auth, deleteFile);
router.post("/", auth, createFile);
router.get("/", auth, getFile);
router.delete("/:fileName", auth, deleteFile);
router.put("/rename", auth, renameFile);

export default router;
