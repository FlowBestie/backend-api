import {Router} from 'express';
import { getCalendarData, generateIcsFile } from '../controllers/calendar.js';

const calendarRouter = Router();

// Route to get calendar data
calendarRouter.get('/calendar/data', getCalendarData);

// Route to generate ICS file
calendarRouter.get('/calendar/generate-ics', generateIcsFile);

export default calendarRouter;
