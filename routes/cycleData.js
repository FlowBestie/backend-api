import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getCycleResults, createCycleData, updateCycleData } from '../controllers/cycleData.js';

const cycleDataRouter = Router();

// Route to get the latest cycle results for the logged-in user
cycleDataRouter.get('/cycle/results',isAuthenticated, getCycleResults);

// Route to create new cycle data
cycleDataRouter.post('/cycle/data', createCycleData);

// Route to update existing cycle data
cycleDataRouter.patch('/cycle/data/:id',isAuthenticated, updateCycleData);

// Export router

export default cycleDataRouter;
