import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.js";



export const isAuthenticated = async (req, res, next) => {
    try {
        // Check if session has user
        if (req.session.user) {
            // Check if user exist in database
            const user = await UserModel.findById(req.session.user.id);
            if (!user) {
                return res.status(401).json('User Does Not Exist!');
            }
            // Call next function
            next();
        } else if (req.headers.authorization) {
            try {
                // Extract token from headers
                const token = req.headers.authorization.split(' ')[1];
                // Verify the token to get user and append to request
                req.user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
                // Check if user exist in database
                const user = await UserModel.findById(req.user.id);
                if (!user) {
                    return res.status(401).json('User Does Not Exist!');
                }
                // Call next function
                next();
            } catch (error) {
                res.status(401).json(error);
            }
        } else {
            res.status(401).json('Not Authenticated!');
        }
    } catch (error) {
        next(error);
    }
}