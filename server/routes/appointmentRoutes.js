import express from 'express';
import { createAppointment, deleteAppointment, getAppointments } from '../controllers/appointmentController.js';
const router = express.Router();

router.get('/', getAppointments)
router.post('/create', createAppointment)
router.delete('/delete/:id', deleteAppointment)

export default router;