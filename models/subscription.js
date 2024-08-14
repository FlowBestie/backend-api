import { model, Schema } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";
import mongooseErrors from "mongoose-errors";

const subscriptionSchema = new Schema({
  email: { type: String, required: true, unique: true },
 
},{
    timestamps:true
});

export const SubscriptionModel = model('Subscription', subscriptionSchema);

subscriptionSchema.plugin(toJSON);
subscriptionSchema.plugin(mongooseErrors);
