import Appointment from '../models/Appointment.js';


export const createAppointment = async (req, res) => {
    try {
        const { patient, doctor, appointmentDate, reason } = req.body;

        // 1. Check if the doctor already has an appointment at this exact time
        const existingAppointment = await Appointment.findOne({
            doctor: doctor,
            appointmentDate: new Date(appointmentDate)
        });

        if (existingAppointment) {
            return res.status(400).json({ 
                msg: 'This doctor is already booked for this specific time slot.' 
            });
        }

        // 2. If no conflict, create the new appointment
        const newAppointment = new Appointment({
            patient,
            doctor,
            appointmentDate,
            reason
        });

        await newAppointment.save();
        res.status(201).json(newAppointment);

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Server Error' });
    }
}

// controllers/appointmentController.js
export const getAppointments = async (req, res) => {
    try {
        const { date } = req.query; 
        let query = {};

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            query.appointmentDate = { $gte: startOfDay, $lte: endOfDay };
        }

        const appointments = await Appointment.find(query)
            .populate('patient')
            .populate('doctor')
            .sort({ appointmentDate: 1 });

        // Always return JSON array
        res.status(200).json(appointments || []); 
    } catch (error) {
        console.error(error);
        res.status(500).json([]); // Return empty array on error to prevent frontend crash
    }
};
export const deleteAppointment = (req, res) => {
    try {

        const { id } = req.params;
        Appointment.findByIdAndDelete(id)
            .then(() => res.status(200).json({ msg: 'Appointment deleted' }))
            .catch(err => {
                console.log(err);
                res.status(500).send('Server Error');
            });


    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}