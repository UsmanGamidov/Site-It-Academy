import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    message: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ['новая', 'в обработке', 'завершена'],
        default: 'новая',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

export default mongoose.model('Application', ApplicationSchema);
