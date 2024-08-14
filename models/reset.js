import { model, Schema,Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";
import mongooseErrors from "mongoose-errors";


const resetTokenSchema = new Schema({
    userId: { type: Types.ObjectId, required: true, ref: 'User' },
    expired: { type: Boolean, default: false },
    expiresAt: {
        type: Date,
        default: () => new Date().setHours(new Date().getHours() + 2)
    }
}, {
    timestamps: true,
    versionKey:false
});
resetTokenSchema
    .plugin(mongooseErrors)
    .plugin(toJSON);


    export const ResetTokenModel = model('ResetToken', resetTokenSchema);