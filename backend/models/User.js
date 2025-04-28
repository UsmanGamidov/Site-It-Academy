import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        default: "",
        required: false,
    },
    middleName: {
        type: String,
        default: "",
        required: false,
    },
    birthDate: { 
        type: Date,
        required: false,
    },
    gender: {
        type: String,
        default: "male",
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: { 
        type: String,
        default: "https://i.pinimg.com/736x/2d/1c/fc/2d1cfce20ae0c1fbdf7084273126996f.jpg",
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
}, {
    timestamps: true,
})

export default mongoose.model('User', UserSchema)