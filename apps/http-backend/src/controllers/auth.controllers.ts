import { Request, Response } from "express";
import { SignupSchema } from "@repo/zod-schema/type"
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";

export async function signup(req:Request, res: Response) {
    const parsedData = SignupSchema.safeParse(req.body);

    if(!parsedData.success) {
        return res.status(401).json({
            error:  parsedData.error
        })
    }

    try {
        const existingEmail = await prismaClient.user.findFirst({
            where: {
                email: parsedData.data.email
            }
        })
    
        if(existingEmail){
            return res.status(409).json({ error: 'Email already exists' });
        }
    
        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
    
        const user = await prismaClient.user.create({
            data:{
                email: parsedData.data.email,
                name:  parsedData.data.name,
                password: hashedPassword
            }
        })
    
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res
        .status(500)
        .json({
            message: "Internal server error",
            error: error
        })
    }
}
export async function signin(req:Request, res: Response) {
    
}