import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const createDoctor = async (req, res) => {
    try {
        const { name, specialization, contactNumber, email, password } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'Doctor login already exists with this email' });
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create User (for login)
        const user = await User.create({
            username: name,
            email,
            password: hashedPassword,
            role: 'doctor'
        });

        // 4. Create Doctor profile linked to User
        const doctor = await Doctor.create({
            user: user._id,
            name,
            specialization,
            contactNumber,
            email
        });

        res.status(201).json({ doctor, user });

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

export const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('user', 'email role');
        res.json(doctors);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

export const deleteDoctors = async (req, res) => {
    try {
        const { id } = req.params;

        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ msg: 'Doctor not found' });
        }

        // Delete linked user also
        await User.findByIdAndDelete(doctor.user);
        await Doctor.findByIdAndDelete(id);

        res.json({ msg: 'Doctor and login deleted successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

export const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, specialization, contactNumber, email } = req.body;

        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ msg: 'Doctor not found' });
        }

        doctor.name = name || doctor.name;
        doctor.specialization = specialization || doctor.specialization;
        doctor.contactNumber = contactNumber || doctor.contactNumber;
        doctor.email = email || doctor.email;

        await doctor.save();
        res.status(200).json(doctor);

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

export const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findById(id).populate('user', 'email role');
        if (!doctor) {
            return res.status(404).json({ msg: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};
