import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {  login, logout, profile, register, token,forgotPassword,verifyResetToken,resetPassword } from "../controllers/user.js";

// Create router
const userRouter = Router();

// Define routes
userRouter.post("/auth/register", register);

userRouter.post("/auth/login", login);

userRouter.post("/auth/token", token);


userRouter.get('/users/profile', isAuthenticated, profile);


userRouter.post('/users/logout', isAuthenticated, logout);

userRouter.post('/users/forgot-password', forgotPassword);

userRouter.get('/users/reset-token/:id', verifyResetToken);

userRouter.post('/users/reset-password', resetPassword);

// Export router
export default userRouter;