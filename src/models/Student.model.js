import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    photo: { type: String },
    phone: { type: Number },
    address: { type: String },
});

export const Student= mongoose.model('Student', studentSchema);


