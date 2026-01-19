import express from 'express';
import { createDoctor, deleteDoctors, getDoctors, updateDoctor,getDoctorById} from '../controllers/doctorsController.js';
const router = express.Router();

router.get('/', getDoctors)
router.get('/:id', getDoctorById)
router.post('/create', createDoctor)
router.put('/update/:id', updateDoctor)
router.delete('/delete/:id', deleteDoctors)

export default router;