import { Router } from "express";
import { createRoom } from "../controllers/room.controllers";

const roomRouter:Router = Router();

roomRouter.post("/create",createRoom)

export default roomRouter