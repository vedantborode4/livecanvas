import express from "express"
import userRouter from "./routes/user.routes";
import { authMiddleware } from "./middleware/auth.middlewares";
import roomRouter from "./routes/room.routes";
import { chatRouter} from "./routes/chats.routes";

const app = express();

app.use(express.json());
app.use("/api/v1", userRouter)
app.use("/api/v1/room",authMiddleware, roomRouter )
app.use("api/v1/chat", authMiddleware, chatRouter)

app.listen(3001)