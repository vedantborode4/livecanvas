import { Router } from "express";
import { signin, signup } from "../controllers/auth.controllers.ts";

const userRouter:Router = Router();

userRouter.post("/signup", signup)
userRouter.post("/signin", signin)

export default userRouter;