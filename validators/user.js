import Joi from "joi";

export const registerValidator = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

export const loginValidator = Joi.object({
    username: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().required(),
});

export const forgotPasswordValidator = Joi.object({
    email: Joi.string().email().required(),
});

export const resetPasswordValidator = Joi.object({
    resetToken: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});



export const cycleDataSchema = Joi.object({
  userId: Joi.string(), 
  periodStartDate: Joi.date().required(),
  periodLength: Joi.number().integer().min(1).required(),  
  cycleLength: Joi.number().integer().min(1).required(),  
  currentCycleDay: Joi.number().integer().min(1), 
  nextPeriodDate: Joi.date(),  
  ovulationDate: Joi.date(), 
  daysToNextPeriod:Joi.number(),
 
});


export const subscriptionSchema = Joi.object({
  email: Joi.string().email().required(), 
 
});




