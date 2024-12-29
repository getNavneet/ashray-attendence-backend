import { StaffAttendance } from "../models/StaffAttendance.model.js";
import { StudentAttendance } from "../models/StudentAttendance.model.js";
import moment from "moment-timezone";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
// Function to get today's date in IST
const getTodayDateIST = () => {
  return moment().tz("Asia/Kolkata").format("YYYY-MM-DD"); // Format: YYYY-MM-DD
};
// Function to get current IST time
const getCurrentISTTime = () => {
  return moment().tz("Asia/Kolkata").format(); // ISO 8601 format
};

export const markCheckIn = async (req, res) => {
  try {
    const { userId } = req.body;
    const file = req.files?.checkInPhoto?.[0];
    if (!userId) {
      return res
        .status(400)
        .json({ message: "userId is required for check-in." });
    }

    // Check if attendance already exists for today
    const todayDate = getTodayDateIST();
    const currentTime = getCurrentISTTime();
    const existingAttendance = await StaffAttendance.findOne({
      user: userId,
      date: todayDate,
    });

    if (existingAttendance && existingAttendance.checkInTime) {
      return res
        .status(400)
        .json({ message: "Check-in already marked for today." });
    }

    // Upload photo to S3
    let photoUrl = null;
    if (file) {
      photoUrl = await uploadOnCloudinary(file.path, "staff_checkin_photos");
  }
  else{
      photoUrl = "https://res.cloudinary.com/dxkufsejm/image/upload/v1633666824/blank-profile-picture-973460_640_ewvz9d.png"
  }

    // Create or update attendance record
    const attendance = await StaffAttendance.findOneAndUpdate(
      { user:userId, date: todayDate },

      {
        checkInTime: currentTime,
        checkInPhoto: photoUrl,
      },
      { new: true, upsert: true }
    );

    res
      .status(200)
      .json({ message: "Check-in marked successfully.", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markCheckOut = async (req, res) => {
  try {
    const { userId } = req.body; 
    const file = req.files?.checkOutPhoto?.[0];

    if (!userId) {
      return res
        .status(400)
        .json({ message: "userId is required for check-out." });
    }

    const todayDate = getTodayDateIST();
    const currentTime = getCurrentISTTime();

    // Check if attendance exists for today
    const attendance = await StaffAttendance.findOne({ user:userId, date: todayDate });

    if (!attendance) {
      return res
        .status(400)
        .json({
          message: "No check-in found for today. Please check in first.",
        });
    }

    if (attendance.checkOutTime) {
      return res
        .status(400)
        .json({ message: "Check-out already marked for today." });
    }

    // Upload photo to S3
    let photoUrl = null;
    if (file) {
      photoUrl = await uploadOnCloudinary(file.path, "staff_checkout_photos");
  }
  else{
      photoUrl = "https://res.cloudinary.com/dxkufsejm/image/upload/v1633666824/blank-profile-picture-973460_640_ewvz9d.png"
  }

    // Update attendance record
    attendance.checkOutTime = currentTime;
    attendance.checkOutPhoto = photoUrl;
    attendance.isForgottenCheckout = false; // If no photo, mark as forgotten
    await attendance.save();

    res
      .status(200)
      .json({ message: "Check-out marked successfully.", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// API to mark attendance for all students
export const submitStudentAttendance = async (req, res) => {
    try {
        const { attendance, markedBy } = req.body; // `attendance` is an array of { studentId, status }

        if (!Array.isArray(attendance) || attendance.length === 0) {
            return res.status(400).json({ message: "Attendance data is required." });
        }

        const todayDate = getTodayDateIST();

        // Iterate over each student and upsert (create or update) attendance record
        const bulkOperations = attendance.map(({ studentId, status }) => {
            return {
                updateOne: {
                    filter: { studentId, date: todayDate }, // Find by studentId and today's date
                    update: { $set: { status, markedBy, date: todayDate } },
                    upsert: true, // Create if not found
                },
            };
        });

        await StudentAttendance.bulkWrite(bulkOperations);

        res.status(200).json({ message: "Attendance submitted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
