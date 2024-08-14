import { model, Schema,Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";
import mongooseErrors from "mongoose-errors";



const cycleDataSchema = new Schema({
  
  userId: { type: Types.ObjectId, ref: 'User', required: true ,select:false}, 
  periodStartDate: { type: Date, required: true },
  periodLength: { type: Number, required: true },  // Duration of the period in days
  cycleLength: { type: Number, required: true },  // Length of the menstrual cycle in days
  currentCycleDay: { type: Number },  // Calculated based on the period start date
  nextPeriodDate: { type: Date },  // Calculated next period start date
  ovulationDate: { type: Date },  // Calculated ovulation date
  daysToNextPeriod: { type: Number },  // Calculated number of days to the next period
 
},{
    timestamps:true,
    versionKey:false
});

cycleDataSchema.plugin(toJSON);
cycleDataSchema.plugin(mongooseErrors);

export const CycleData = model('CycleData', cycleDataSchema);

 