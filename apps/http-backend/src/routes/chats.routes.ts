import { Router } from "express";
import { chats, getRoomFromSlug } from "../controllers/chats.controllers";

export const chatRouter:Router = Router();

chatRouter.post("/room/:roomId", chats)
chatRouter.post("/slug/:slug", getRoomFromSlug)