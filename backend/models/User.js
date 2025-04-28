import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: false,
    },
    middleName: {
        type: String,
        required: false,
    },
    birthDate: { 
        type: Date,
        required: false,
    },
    gender: {
        type: String,
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
        default: "https://cdn-icons-png.flaticon.com/512/4837/4837857.png",
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
}, {
    timestamps: true,
})

export default mongoose.model('User', UserSchema)