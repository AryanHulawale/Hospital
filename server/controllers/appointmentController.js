import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

// Create appointment (Admin)
export const createAppointment = async (req, res) => {
    try {
        const { patient, doctorUserId, appointmentDate, reason } = req.body;

        const existingAppointment = await Appointment.findOne({
            doctor: doctorUserId,
            appointmentDate: new Date(appointmentDate)
        });

        if (existingAppointment) {
            return res.status(400).json({ msg: 'Doctor already booked for this slot.' });
        }

        const appointment = await Appointment.create({
            patient,
            doctor: doctorUserId,
            appointmentDate,
            reason
        });

        res.status(201).json(appointment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// controllers/appointmentController.js
export const getAppointments = async (req, res) => {
    try {
        const { date } = req.query;
        let query = {};

        if (date) {
            const start = new Date(date);
            start.setHours(0,0,0,0);
            const end = new Date(date);
            end.setHours(23,59,59,999);
            query.appointmentDate = { $gte: start, $lte: end };
        }

        const appointments = await Appointment.find(query)
            .populate('patient')
            .populate('doctor', 'email role') // This gets the User info
            .sort({ appointmentDate: 1 });

        // Merge Doctor profile names into the response
        const enrichedAppointments = await Promise.all(appointments.map(async (app) => {
            const doctorProfile = await Doctor.findOne({ user: app.doctor._id });
            return {
                ...app._doc,
                doctorName: doctorProfile ? doctorProfile.name : "Unknown Doctor"
            };
        }));

        res.json(enrichedAppointments);
    } catch (error) {
        res.status(500).json([]);
    }
};

// Doctor – today only
export const getMyTodayAppointments = async (req, res) => {
    try {
        const doctorId = req.user.id;

        const start = new Date();
        start.setHours(0,0,0,0);
        const end = new Date();
        end.setHours(23,59,59,999);

        const appointments = await Appointment.find({
            doctor: doctorId,
            appointmentDate: { $gte: start, $lte: end }
        })
        .populate('patient')
        .sort({ appointmentDate: 1 });

        res.json(appointments);
    } catch (error) {
        res.status(500).json([]);
    }
};

export const deleteAppointment = async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Deleted' });
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

export const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updated = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
};
