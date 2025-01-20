import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
    name: 
    { 
        type: String,
        required: true, 
        unique: true 
    },
    description: 
    { 
        type: String,
    },
    students: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student' 
    }],
    teachers: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher' 
    }]
});
export const Class = mongoose.model('Class', classSchema);
