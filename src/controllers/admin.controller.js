import { User } from "../models/user.model.js";
import { Student } from "../models/Student.model.js";
import { StaffAttendance } from "../models/StaffAttendance.model.js";
import { StudentAttendance } from "../models/StudentAttendance.model.js";
import moment from "moment-timezone";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Register new staff
export const registerStaff = async (req, res) => {
    try {
        const { name, role, email, password } = req.body;
        const file = req.files?.photo?.[0];
         
// Check if the user already exists
const existingUser = await User.findOne({ email });
if (existingUser) {
    return res.status(400).json({ message: "Staff with this email already exists" });
}


      let photoUrl = null;
       // Upload photo to S3
        // if (file) {
        //     photoUrl = await uploadToS3(file.path, "staff_photos");
        // }

        //upload on cloudinary
        if (file) {
            photoUrl = await uploadOnCloudinary(file.path, "staff_photos");
        }
        else{
            photoUrl = "https://res.cloudinary.com/dxkufsejm/image/upload/v1633666824/blank-profile-picture-973460_640_ewvz9d.png"
        }

        

        const staff = await User.create({
            name,
            role,
            email,
            password,
            photo: photoUrl,
        });

        res.status(201).json({ message: "Staff registered successfully", staff });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Register new student
export const registerStudent = async (req, res) => {
    try {
        const { name, rollNo,phone,address } = req.body;
        const file = req.files?.photo?.[0];
         
        const existingStudent = await Student.findOne({ rollNo });
        if (existingStudent) {
            return res.status(400).json({ message: "student with this email already exists" });
        }

        let photoUrl = null;
       // Upload photo to S3
        // if (file) {
        //     photoUrl = await uploadToS3(file.path, "staff_photos");
        // }

        //upload on cloudinary
        if (file) {
            photoUrl = await uploadOnCloudinary(file.path, "student_photos");
        }

        const student = await Student.create({
            name,
            rollNo,
            phone,
            address,
            photo: photoUrl,
        });

        res.status(201).json({ message: "Student registered successfully", student });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all students
export const allStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json({ students });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all staff
export const allStaff = async (req, res) => {
    try {
        const staff = await User.find({ role: { $ne: "admin" } }); // Exclude admins
        res.status(200).json({ staff });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update staff
export const updateStaff = async (req, res) => {
    try {
        const { id, updates } = req.body;
        const updatedStaff = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedStaff) return res.status(404).json({ message: "Staff not found" });
        res.status(200).json({ message: "Staff updated successfully", updatedStaff });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update student
export const updateStudent = async (req, res) => {
    try {
        const { id, updates } = req.body;
        const updatedStudent = await Student.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedStudent) return res.status(404).json({ message: "Student not found" });
        res.status(200).json({ message: "Student updated successfully", updatedStudent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete staff
export const deleteStaff = async (req, res) => {
    try {
        const { id } = req.body;
        const deletedStaff = await User.findByIdAndDelete(id);
        if (!deletedStaff) return res.status(404).json({ message: "Staff not found" });
        res.status(200).json({ message: "Staff deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete student
export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.body;
        const deletedStudent = await Student.findByIdAndDelete(id);
        if (!deletedStudent) return res.status(404).json({ message: "Student not found" });
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get today's attendance for staff
export const todayAttendanceStaff = async (req, res) => {
    try {
        // Get today's date in IST (format YYYY-MM-DD)
        const todayDate = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

        // Find attendance records for today
        const attendance = await StaffAttendance.find({
            date: todayDate,
            checkInTime: { $ne: null }, // Only records with check-in time
        }).populate('user', 'name role email'); // Populate user details (name, role, email)

        res.status(200).json({ attendance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get today's attendance for students
export const todayAttendanceStudents = async (req, res) => {
    try {
        const today = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
        const attendance = await StudentAttendance.find({ date: today }).populate('studentId', 'name');
        res.status(200).json({ attendance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get attendance history for staff
export const attendenceHistoryStaff = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const attendance = await StaffAttendance.find({
            date: { $gte: startDate, $lte: endDate }
        });
        res.status(200).json({ attendance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get attendance history for students
export const attendanceHistoryStudents = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const attendance = await StudentAttendance.find({
            date: { $gte: startDate, $lte: endDate }
        });
        res.status(200).json({ attendance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
