import mongoose from "mongoose";

const DirectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    tags: {
        type: Array,
        default: []
    }
})

export default mongoose.model('Direction', DirectionSchema)