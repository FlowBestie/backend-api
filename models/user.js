import { model, Schema } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const userSchema = new Schema({
    firstname: { type: String, required: true },
    lastname:{type: String, required: true},
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: {type: String, required: true}

}, {
    timestamps: true
});

userSchema.plugin(toJSON);

export const UserModel = model('User', userSchema);