import Patient from '../models/Patient.js';

export const createPatients = async (req, res) => {
    try {

        const { name, age, gender, address, contactNumber, medicalHistory } = req.body;

        const existingPatient = await Patient.findOne({ contactNumber });
        if (existingPatient) {
            return res.status(400).json({ msg: 'Patient with this contact number already exists' });
        }

        const newPatient = new Patient({
            name,
            age,
            gender,
            address,
            contactNumber,
            medicalHistory
        });
        await newPatient.save();
        res.status(201).json(newPatient);

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}
export const getPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        if (!patients) {
            return res.status(404).json({ msg: 'No patients found' });
        }
        res.json(patients);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}
export const deletePatients = async (req, res) => {
    try {

        const { id } = req.params;
        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({ msg: 'Patient not found' });
        }
        await Patient.findByIdAndDelete(id);
        res.json({ msg: 'Patient deleted successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}



export const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, gender, address, contactNumber, medicalHistory } = req.body

        const patient = await Patient.findById(id);
        if (!patient) {
            res.status(404).json({ msg: 'Patient not found' });
        }

        const existingPatient = await Patient.findOne({ contactNumber });
        if (existingPatient && existingPatient._id.toString() !== id) {
            return res.status(400).json({ msg: 'Another patient with this contact number already exists' });
        }

        patient.name = name || patient.name
        patient.age = age || patient.age
        patient.gender = gender || patient.gender
        patient.address = address || patient.address
        patient.contactNumber = contactNumber || patient.contactNumber
        patient.medicalHistory = medicalHistory || patient.medicalHistory

        await patient.save();
        res.status(200).json(patient);

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}


export const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({ msg: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}