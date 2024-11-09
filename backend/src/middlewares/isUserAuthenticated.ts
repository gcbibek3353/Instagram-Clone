import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET;


// Extend the Request interface to include a custom `id` property
interface CustomRequest extends Request {
    id?: string;
}

// Define the type for the JWT payload, including `userId`
interface JwtPayload {
    userId: string;
}

export const isUserAuthenticated = (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        // console.log(`authentication started`);
        const token = req.cookies.token;
        if (!token) return res.status(401).json({
            success: false,
            message: 'token not found'
        })

        const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;

        if (!decoded) return res.status(401).json({
            success: false,
            message: 'Token is not verified'
        })

        req.id = decoded.userId;
        // console.log('authentication passed');
        next()
    } catch (error: any) {
        console.log(error.message);
        return res.status(401).json({
            message: "Error while authenticating User",
            error: error.message,
            success: false
        })
    }
}