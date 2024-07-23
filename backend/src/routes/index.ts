import express from "express";
import authRouter from "./auth";
import taskRouter from "./todo";
import userRouter from "./user";

const router = express();

router.use("/tasks", taskRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);
export default router;
