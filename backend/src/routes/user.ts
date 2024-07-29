import express from "express";
import {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controller/user";
import { ROLE } from "../enums/role";
import { auth, authorize } from "../middleware/auth";
import { validateReqParams, validateReqQuery } from "../middleware/validator";
import { paramSchema } from "../schema/file";
import { getUserQuerySchema } from "../schema/user";
const router = express();
router.get(
  "/",
  validateReqQuery(getUserQuerySchema),
  auth,
  authorize(ROLE.ADMIN),
  getUsers
);
router.get(
  "/:id",
  auth,
  validateReqParams(paramSchema),
  authorize(ROLE.ADMIN),
  getUserById
);
router.put(
  "/:id",
  auth,
  validateReqParams(paramSchema),
  validateReqQuery(getUserQuerySchema),
  authorize(ROLE.ADMIN),
  updateUser
);
router.delete(
  "/:id",
  auth,
  validateReqParams(paramSchema),
  authorize(ROLE.ADMIN),
  deleteUser
);
export default router;
