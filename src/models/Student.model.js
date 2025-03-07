import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    uid: { type: String, required: true, unique: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    photo: { type: String },
    aadharNumber: { type: Number },
    fatherPhone: { type: Number },
    address: { type: String },
});

export const Student= mongoose.model('Student', studentSchema);

