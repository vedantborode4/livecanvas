import { Request, Response } from "express";
import { SigninSchema, SignupSchema } from "@repo/zod-schema/type"
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";
import {JWT_SECRET} from "@repo/backend-common/config";
import jwt  from "jsonwebtoken";

export async function signup(req:Request, res: Response) {
    const parsedData = SignupSchema.safeParse(req.body);

    if(!parsedData.success) {
        res.status(401).json({
            error:  parsedData.error
        })
        return
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
    
        res.status(200).json({ message: 'User registered successfully' });
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
    const parsedData = SigninSchema.safeParse(req.body);

    if(!parsedData.success){
        return res.status(401)
        .json({
            "error": parsedData.error
        })
    }

    try {
        const user = await prismaClient.user.findUnique({
            where: {
                email: parsedData.data.email
            }
        })
    
        if(!user){
            res.status(401).json({ message: "User not found" });
            return;
        }
    
        const isValid = await bcrypt.compare(parsedData.data.password, user.password,);
    
        if(!isValid){
            res.status(401).json({ message: "Incorrect Password" });
            return;
        }
    
        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET,
        {
            expiresIn: "72h"
        }
        )
    
        res.status(200)
        .json({
            token: token,
            Message:  "Signin Successful"
        })

    } catch (error) {
        res.status(403)
        .json({
            message: "Internal server error",
            error: error
        })
    }
}