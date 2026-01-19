import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Patients from './pages/Patients';
import PatientInfo from './pages/PatientInfo'; 
import Doctors from './pages/Doctors';
import DoctorInfo from './pages/DoctorInfo'; 
import Appointments from './pages/Appointments';
import Dashboard from './pages/Dashboard';
import DoctorDashboard from './pages/DoctorsDashboard'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import Layout from './components/Layout';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* --- ADMIN ONLY PAGES --- */}
        <Route path="/" element={
          <ProtectedRoute allowedRole="admin">
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/doctors" element={
          <ProtectedRoute allowedRole="admin">
            <Layout><Doctors /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/doctors/:id" element={
          <ProtectedRoute allowedRole="admin">
            <Layout><DoctorInfo /></Layout>
          </ProtectedRoute>
        } />

        {/* --- DOCTOR ONLY PAGES --- */}
        <Route path="/doctor-dashboard" element={
          <ProtectedRoute allowedRole="doctor">
            <Layout><DoctorDashboard /></Layout>
          </ProtectedRoute>
        } />
        
        {/* --- SHARED OR ADMIN MANAGEMENT --- */}
        {/* If doctors shouldn't see the patient list at all, keep allowedRole="admin" */}
        <Route path="/patients" element={
          <ProtectedRoute allowedRole="admin">
            <Layout><Patients /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/patients/:id" element={
          <ProtectedRoute allowedRole="admin">
            <Layout><PatientInfo /></Layout>
          </ProtectedRoute>
        } />
        
        {/* If doctors shouldn't see the master appointment list, set allowedRole="admin" */}
        <Route path="/appointments" element={
          <ProtectedRoute allowedRole="admin">
            <Layout><Appointments /></Layout>
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;