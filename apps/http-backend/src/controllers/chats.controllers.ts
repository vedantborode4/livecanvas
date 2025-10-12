import { prismaClient } from "@repo/db/client";
import { Request, Response } from "express";

export async function chats(req:Request , res: Response) {
try {
        const roomId = Number(req.params.roomId);
    
        const messages = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 50
        })
    
        res.json({
            messages
        })
} catch (e) {
        console.log(e);
        res.json({
            messages: []
        })
}
}

export async function getRoomFromSlug(req: Request, res: Response) {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })   
}