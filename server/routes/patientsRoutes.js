import express from 'express';
import { createPatients, deletePatients, getPatients, updatePatient,getPatientById } from '../controllers/patientsController.js';
const router = express.Router();

router.get('/', getPatients)
router.get('/:id', getPatientById)
router.post('/create', createPatients)
router.put('/update/:id', updatePatient)
router.delete('/delete/:id', deletePatients)

export default router;