import express from "express";
import { login, refresh, signup } from "../controller/auth";
import { ROLE } from "../enums/role";
import { auth, authorize } from "../middleware/auth";
import { validateReqBody } from "../middleware/validator";
import { createUserBodySchema } from "../schema/user";
const router = express();
router.post("/login", login);
router.post(
  "/signup",
  validateReqBody(createUserBodySchema),
  // auth,
  // authorize(ROLE.ADMIN),
  signup
);
router.get("/refresh-token", auth, refresh);
export default router;
