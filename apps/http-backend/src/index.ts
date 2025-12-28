import express from "express"
import userRouter from "./routes/user.routes";
import { authMiddleware } from "./middleware/auth.middlewares";
import roomRouter from "./routes/room.routes";
import { chatRouter} from "./routes/chats.routes";
import cors from "cors";
import "dotenv/config"

const app = express();

const ORIGIN = process.env.ORIGIN

app.use(cors({
    origin: ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

app.use(express.json());
app.use("/api/v1", userRouter)
app.use("/api/v1/room",authMiddleware, roomRouter )
app.use("/api/v1/chat", authMiddleware, chatRouter)

app.listen(3001)