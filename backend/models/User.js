import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
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
    }
}, {
    timestamps: true,
})

export default mongoose.model('User', UserSchema)