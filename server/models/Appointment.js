import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',   // IMPORTANT: link to User, not Doctor
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
    }
}, { timestamps: true });

// Prevent same doctor double booking at same time
appointmentSchema.index({ doctor: 1, appointmentDate: 1 }, { unique: true });

export default mongoose.model('Appointment', appointmentSchema);
