import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    imageUrl: { 
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/4837/4837857.png",
    },
    timeEnd: {
        type: Number,
        default: 5,
    }
    grade: {
        type: Array,
        default: [5],
    },
    filter: {
        type: Array,
        default: ["all"]
    },
    tags: {
        type: Array,
        default: ["all"]
    }
})

export default mongoose.model('Direction', CourseSchema)