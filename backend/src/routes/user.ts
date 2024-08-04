import express from "express";
import {
  deleteUser,
  getUserById,
  getUsers,
  updaePassword,
} from "../controller/user";
import { ROLE } from "../enums/role";
import { auth, authorize } from "../middleware/auth";
import { validateReqParams, validateReqQuery } from "../middleware/validator";
import { getUserQuerySchema, paramSchema } from "../schema/user";

const router = express();
router.get(
  "/",
  // validateReqQuery(getUserQuerySchema),
  auth,
  authorize(ROLE.ADMIN),
  getUsers
);

router.put("/", auth, updaePassword);

router.delete(
  "/:id",
  auth,
  validateReqParams(paramSchema),
  authorize(ROLE.ADMIN),
  deleteUser
);

router.get(
  "/:id",
  auth,
  validateReqParams(paramSchema),
  authorize(ROLE.ADMIN),
  getUserById
);

export default router;
