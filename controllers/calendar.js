import {CycleData} from "../models/cycleData.js";
import ics from "ics";

export const getCalendarData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the latest cycle data entry for the user
    const cycleData = await CycleData.findOne({ userId }).sort({
      createdAt: -1,
    });

    if (!cycleData) {
      return res
        .status(404)
        .json({ success: false, error: "No cycle data found." });
    }

    // Extract the relevant dates
    const { periodStartDate, nextPeriodDate, ovulationDate } = cycleData;

    // Prepare the calendar data
    const calendarData = {
      periodStartDate: periodStartDate.toISOString().split("T")[0], // Format date as YYYY-MM-DD
      ovulationDate: ovulationDate.toISOString().split("T")[0],
      nextPeriodDate: nextPeriodDate.toISOString().split("T")[0],
    };

    res.status(200).json({ success: true, data: calendarData });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        error: "An error occurred while retrieving calendar data.",
      });
  }
};

export const generateIcsFile = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    // Fetch the latest cycle data for the user
    const cycleData = await CycleData.findOne({ userId }).sort({
      createdAt: -1,
    });

    if (!cycleData) {
      return res
        .status(404)
        .json({ success: false, error: "No cycle data found for the user." });
    }

    const { periodStartDate, cycleLength, nextPeriodDate, ovulationDate } =
      cycleData;

    // Calculate daysToNextPeriod
    const today = new Date();
    const daysToNextPeriod = Math.floor(
      (new Date(nextPeriodDate) - today) / (1000 * 60 * 60 * 24)
    );

    // Create the event for the next period date
    const event = {
      start: [
        nextPeriodDate.getFullYear(),
        nextPeriodDate.getMonth() + 1,
        nextPeriodDate.getDate(),12,0,], // Midday

      duration: { hours: 0, minutes: 0 }, // Example duration

      title: `Your Next Period`,

      description: `This is a reminder that your next period is expected to start on ${nextPeriodDate.toDateString()}.`,

      categories: ["Reminder"],
      alarms: [
        {
          action: "display",
          description: "Reminder",
          trigger: { days: 1, hours: 12, minutes: 0, before: true },
        },
      ],
    };

    // Generate ICS file content
    ics.createEvent(event, (error, value) => {
      if (error) {
        return res
          .status(500)
          .json({ success: false, error: "Error generating ICS file." });
      }

      // Return the ICS file as a downloadable attachment
      res.setHeader("Content-Type", "text/calendar");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="next_period_${userId}.ics"`
      );
      return res.send(value);
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        error: "An error occurred while generating the ICS file.",
      });
  }
};
