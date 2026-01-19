import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true,unique: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // ADD THIS FIELD
    role: { 
        type: String, 
        enum: ['admin', 'doctor'], 
        default: 'doctor' 
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);