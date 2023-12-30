import { Request, Response, NextFunction } from "express";
export function adminAccess(req: Request,res: Response,next: NextFunction) {
    const { adminAccessToken } = req.body;
    
    // Check if the admin has permission to perform DANGER operation
    if(adminAccessToken === process.env.ADMIN_ACCESS_TOKEN) {
        next();
    } else {
        return res.status(401).json({
            status: 401,
            message: 'You do not have such permissions.',
            data: null
        });
    }
}