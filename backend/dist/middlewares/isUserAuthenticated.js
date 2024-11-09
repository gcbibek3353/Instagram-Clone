import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;
export const isUserAuthenticated = (req, res, next) => {
    try {
        // console.log(`authentication started`);
        const token = req.cookies.token;
        if (!token)
            return res.status(401).json({
                success: false,
                message: 'token not found'
            });
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded)
            return res.status(401).json({
                success: false,
                message: 'Token is not verified'
            });
        req.id = decoded.userId;
        // console.log('authentication passed');
        next();
    }
    catch (error) {
        console.log(error.message);
        return res.status(401).json({
            message: "Error while authenticating User",
            error: error.message,
            success: false
        });
    }
};
