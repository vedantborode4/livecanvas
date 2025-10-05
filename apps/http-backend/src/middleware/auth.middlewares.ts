
import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt  from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    
    const header = req.headers["authorization"]

    if (!header) {
        return res
        .status(401)
        .json({ message: "Unauthorized: No authorization header provided" });
    }
    
    const token = header?.startsWith("Bearer ") ? header.split(" ")[1] : header;

    if (!token) {
        return res
        .status(401)
        .json({ message: "Unauthorized: Token missing!" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {userId : string};

        req.userId = decoded.userId;
        
        next()

    } catch (error) {
        
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
    }
}