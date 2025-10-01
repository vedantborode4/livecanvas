import express from "express"
import userRouter from "./routes/user.routes.ts";

const app = express();

app.use("/api/v1", userRouter)

app.listen(3001)