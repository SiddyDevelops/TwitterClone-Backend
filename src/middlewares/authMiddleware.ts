import { Request, Response, NextFunction } from "express";
import { PrismaClient, User } from "@prisma/client";
const prisma = new PrismaClient();

import jwt from 'jsonwebtoken';
const JWT_SECRET = "SUPER_SECRET";

type AuthRequest = Request & { user?: User }

export async function authenticateToken(req: AuthRequest,res: Response,next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const jwtToken = authHeader?.split(" ")[1];
    if(!jwtToken) {
        return res.status(401).json({
            status: 401,
            message: 'Unauthroized Access.',
            data: null
        });
    }

    try {
        const payload = await jwt.verify(jwtToken, JWT_SECRET) as { tokenId:number };
        if(!payload?.tokenId) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthroized Access.',
                data: null
            });
        }

        const dbToken = await prisma.token.findUnique({
            where: { id: payload.tokenId },
            include: { user: true }
        });

        if(!dbToken || !dbToken.valid) {
            return res.status(401).json({
                status: 401,
                message: 'User is invalidated from client panel.',
                data: dbToken
            });
        } 
        if(dbToken.expiration < new Date()) {
            return res.status(401).json({
                status: 401,
                message: 'Token has expired.',
                data: `Validity till time: ${dbToken.expiration}`
            });
        }
        req.user = dbToken.user;
    } catch (err) {
        return res.status(400).json({
            status: 400,
            message: err,
            data: null
        });
    }
    next();
}