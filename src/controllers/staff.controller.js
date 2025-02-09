import { StaffAttendance } from "../models/StaffAttendance.model.js";
import { StudentAttendance } from "../models/StudentAttendance.model.js";
import { Student } from "../models/Student.model.js";
import { User } from "../models/user.model.js";
import moment from "moment-timezone";
import { uploadToS3 } from "../utils/uploadToS3.js";
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
    const file = req.files?.checkinPhoto?.[0];
    
    if (!userId) {
      return res
        .status(400)
        .json({ message: "userId is required for check-in." });
    }
    if (!file) {
      return res
        .status(400)
        .json({ message: "photo is required for check-in." });
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

    let photoUrl = null;
        if (file) {
            photoUrl = await uploadToS3(file.path, "Check_in_photos");
        }
        else(
          photoUrl="https://ashraymediastorage.s3.ap-south-1.amazonaws.com/noImageAvailable.png"
        )

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
    const file = req.files?.checkoutPhoto?.[0];

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
            photoUrl = await uploadToS3(file.path, "Check_out_photos");
        }
        else(
          photoUrl="https://ashraymediastorage.s3.ap-south-1.amazonaws.com/noImageAvailable.png"
        )

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


// Get all students for the teacher's class
export const allStudents = async (req, res) => {
  try {
    const { teacherId } = req.params; 

    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }


    const classId = teacher.class; // Assuming the User model has a `class` field
    if (!classId) {
      return res.status(400).json({ message: "You are not assigned to a class" });
    }

    // Fetch students belonging to the teacher's class
    const students = await Student.find({ class: classId });

    // Map over the students array and return the relevant properties
    const studentData = students.map(student => ({
      id: student._id,
      name: student.name,
      photo: student.photo,
    }));

    res.status(200).json({ students: studentData });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
