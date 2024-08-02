import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {loginValidator, registerValidator} from "../validators/user.js";
import { UserModel } from "../models/user.js";

export const register = async (req, res, next) => {
    try {
        // Validate request
        const { value, error } = registerValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        // Encrypt user password
        const hashedPassword = bcrypt.hashSync(value.password, 10);
        // Create user
        await UserModel.create({
            ...value,
            password: hashedPassword
        });


        // Return response
        res.status(201).json('User Registered');
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        // Validate request
        const { value, error } = loginValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        // Find a user with their unique identifier
        const user = await UserModel.findOne({
            $or: [
                { username: value.username },
                { email: value.email },
            ]
        });
        if (!user) {
            return res.status(401).json('User Not Found');
        }
        // Verify their password
        const correctPassword = bcrypt.compareSync(value.password, user.password);
        if (!correctPassword) {
            return res.status(401).json('Invalid Credentials');
        }
        // Create a session
        req.session.user = { id: user.id }
        // Return response
        res.status(200).json('User Logged In');
    } catch (error) {
        next(error);
    }
}

export const token = async (req, res, next) => {
    try {
        // Validate request
        const { value, error } = loginValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        // Find a user with their unique identifier
        const user = await UserModel.findOne({
            $or: [
                { username: value.username },
                { email: value.email },
            ]
        });
        if (!user) {
            return res.status(401).json('User Not Found');
        }
        // Verify their password
        const correctPassword = bcrypt.compareSync(value.password, user.password);
        if (!correctPassword) {
            return res.status(401).json('Invalid Credentials');
        }
        // Create a token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: '72h' }
        );
        // Return response
        res.status(200).json({
            message: 'User Logged In',
            accessToken: token
        });
    } catch (error) {
        next(error);
    }
}

export const profile = async (req, res, next) => {
    try {
        // Get user id from session or request
        const id = req.session?.user?.id || req?.user?.id;
        // Find user by id
        const user = await UserModel.findById(id)
            .select({ password: false });
        // Return response
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export const logout = async (req, res, next) => {
    try {
        // Destroy user session
        await req.session.destroy();
        // Return response
        res.status(200).json('User Logged Out');
    } catch (error) {
        next(error);
    }
}