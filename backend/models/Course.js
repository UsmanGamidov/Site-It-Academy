import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
        default: "Empty",
    },
    courseTime: {
        type: Number,
        default: 5,
    },
    grade: {
        type: Array,
        default: [5],
    },
    popular: {
        type: Boolean,
        default: false,
    },
    tags: {
        type: Array,
        default: ["all"]
    },
    imageUrl: { 
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/2621/2621040.png",
    },
})

export default mongoose.model('Course', CourseSchema)