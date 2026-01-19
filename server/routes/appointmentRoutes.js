import express from 'express';
import { 
    createAppointment, 
    deleteAppointment, 
    getAppointments, 
    updateAppointmentStatus,
    getMyTodayAppointments
} from '../controllers/appointmentController.js';

import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Admin
router.get('/', getAppointments);
router.post('/create', createAppointment);
router.delete('/delete/:id', deleteAppointment);
router.patch('/:id/status', updateAppointmentStatus);

// Doctor
router.get('/my-today', authMiddleware, getMyTodayAppointments);

export default router;
