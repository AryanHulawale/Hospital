import Doctor from '../models/Doctor.js';

export const createDoctor = async (req, res) => {
    try {
        const { name, specialization, contactNumber, email } = req.body;
        const existingDoctor = await Doctor.findOne({ contactNumber });
        if (existingDoctor) {
            return res.status(400).json({ msg: 'Doctor with this contact number already exists' });
        }
        const newDoctor = new Doctor({
            name,
            specialization,
            contactNumber,
            email
        });
        await newDoctor.save();
        res.status(201).json(newDoctor);


    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}
export const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        if (!doctors) {
            return res.status(404).json({ msg: 'No doctors found' });
        }
        res.json(doctors);

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}
export const deleteDoctors = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ msg: 'Doctor not found' });
        }
        await Doctor.findByIdAndDelete(id);
        res.json({ msg: 'Doctor deleted successfully' });


    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}


export const updateDoctor = async (req, res) => {
    try {
        const {id} = req.params;
        const { name, specialization, contactNumber, email } = req.body

        const doctor = await Doctor.findById(id);
        if(!doctor){
            res.status(404).json({msg: 'Doctor not found'});
        }

        const existingDoctor = await Doctor.findOne({ contactNumber });
        if(existingDoctor && existingDoctor._id.toString() !== id){
            return res.status(400).json({ msg: 'Another doctor with this contact number already exists' });
        }

        doctor.name = name || doctor.name
        doctor.specialization = specialization || doctor.specialization
        doctor.contactNumber = contactNumber || doctor.contactNumber
        doctor.email = email || doctor.email

        await doctor.save();
        res.status(200).json(doctor);

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}



export const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ msg: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}