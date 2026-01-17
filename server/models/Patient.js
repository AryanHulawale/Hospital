import mongoose from 'mongoose';
const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    contactNumber: {
        type: Number,
        required: true
    },
    medicalHistory: {
        type: String,
        required: false
    }
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;