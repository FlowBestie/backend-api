import {CycleData} from "../models/cycleData.js";
import { cycleDataSchema } from "../validators/user.js";

export const createCycleData = async (req, res) => {
  try {
    // Validate the input data
    const { error, value } = cycleDataSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { periodStartDate, periodLength, cycleLength } = value;

    // Calculate the current cycle day
    const today = new Date();
    const startDate = new Date(periodStartDate);
    const timeDifference = today - startDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const currentCycleDay = daysDifference + 1;

    // Calculate the next period date
    const nextPeriodDate = new Date(periodStartDate);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);

    // Calculate the ovulation date
    const ovulationDate = new Date(periodStartDate);
    ovulationDate.setDate(ovulationDate.getDate() + cycleLength - 14);

    // Calculate days to the next period
    const daysToNextPeriod = Math.ceil(
      (nextPeriodDate - today) / (1000 * 60 * 60 * 24)
    );

    // Check if the user is logged in
    const userId = req.user?.id;

    if (userId) {
      // User is logged in, so save the data to the database
      const cycleData = new CycleData({
        userId,
        periodStartDate,
        periodLength,
        cycleLength,
        currentCycleDay,
        nextPeriodDate,
        ovulationDate,
        daysToNextPeriod,
      });

      await cycleData.save();
    }

    // Return the calculated results
    return res.status(200).json({
      currentCycleDay,
      nextPeriodDate,
      ovulationDate,
      daysToNextPeriod,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getCycleResults = async (req, res) => {
  try {
    // Check if the user is authenticated
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Retrieve the cycle data for the logged-in user
    const cycleData = await CycleData.findOne({ userId });

    if (!cycleData) {
      return res
        .status(404)
        .json({ message: "No cycle data found for this user" });
    }

    // Extract and return only the calculated fields
    const { currentCycleDay, nextPeriodDate, ovulationDate, daysToNextPeriod } =
      cycleData;

    return res.status(200).json({
      currentCycleDay,
      nextPeriodDate,
      ovulationDate,
      daysToNextPeriod,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateCycleData = async (req, res) => {
  try {
    // Validate the input data
    const { error, value } = cycleDataSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });
    }

    const { periodStartDate, periodLength, cycleLength } = value;
    const userId = req.user.id;

    // Find the latest cycle data entry for the user and update it
    let cycleData = await CycleData.findOne({ userId }).sort({ createdAt: -1 });

    if (!cycleData) {
      return res
        .status(404)
        .json({ success: false, error: "No cycle data found to update." });
    }

    // Recalculate the cycle details
    const today = new Date();
    const startDate = new Date(periodStartDate);
    
    const currentCycleDay =
      Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    const nextPeriodDate = new Date(startDate);
    nextPeriodDate.setDate(startDate.getDate() + cycleLength);
    
    const ovulationDate = new Date(startDate);
    ovulationDate.setDate(startDate.getDate() + (cycleLength - 14));

    // Calculate days to the next period
    const daysToNextPeriod = Math.ceil(
      (nextPeriodDate - today) / (1000 * 60 * 60 * 24)
    );

    // Update the cycle data
    cycleData = await CycleData.findByIdAndUpdate(
      cycleData.id,
      {
        periodStartDate,
        periodLength,
        cycleLength,
        currentCycleDay,
        nextPeriodDate,
        ovulationDate,
        daysToNextPeriod, 
      },
      { new: true }
    );


    res.status(200).json({ success: true, data: cycleData });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        error: "An error occurred while updating cycle data.",
      });
  }
};
