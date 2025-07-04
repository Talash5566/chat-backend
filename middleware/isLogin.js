import jwt from 'jsonwebtoken';

export const isLogin = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_KEY);

        req.user = decoded; 
        next(); 

    } catch (error) {
        return res.status(401).json({ message: "Please login " });
    }
};
