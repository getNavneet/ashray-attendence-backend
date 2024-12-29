import mongoose from 'mongoose';

const studentAttendanceSchema = new mongoose.Schema({
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student', 
        required: true },
    status: { type: String, required: true, enum: ['present', 'absent'] },
    markedBy: { type: String, required: true },
    date: { type: String, required: true },
});

export const StudentAttendance= mongoose.model('StudentAttendance', studentAttendanceSchema);


