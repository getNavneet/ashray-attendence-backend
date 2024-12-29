import mongoose from 'mongoose';

const staffAttendanceSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    date: { 
        type: String, 
        required: true 
    },
    checkInTime: { 
        type: String 
    },
    checkInPhoto: { 
        type: String 
    },
    checkOutTime: { 
        type: String 
    },
    checkOutPhoto: { 
        type: String 
    },
    isForgottenCheckout: { 
        type: Boolean, 
        default: false 
    }
});

export const StaffAttendance = mongoose.model('StaffAttendance', staffAttendanceSchema);
