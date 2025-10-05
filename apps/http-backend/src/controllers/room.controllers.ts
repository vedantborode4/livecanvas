import { prismaClient } from "@repo/db/client";
import { RoomSchema } from "@repo/zod-schema/type";
import { Request, Response } from "express";

export async function createRoom (req: Request, res: Response) {
    
    const parsedData = RoomSchema.safeParse(req.body)

    if(!parsedData.success){
        return res
        .status(401)
        .json({
            message: "Incorrect input",
            error: parsedData.error
        })
    }

    const userId = req.userId
    if(!userId){
        return res.status(403)
        .json({
            message: "Invalid user"
        })
    }

    try {
        const roomExist = await prismaClient.room.findUnique({
            where:{
                slug: parsedData.data.roomName
            }
        })

        if(roomExist){
            return res.status(401)
            .json({
                message: "Room with this name already exists"
            })
        }

        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.roomName,
                adminId: userId
            }
        })
    
        res.status(200)
        .json({
            roomId: room.id,
            message: "Room created successfully"
        })

    } catch (error) {
        return res
        .status(401)
        .json({ message: "Unable to create room" });
    }
}