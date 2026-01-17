import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Patients from './pages/Patients';
import PatientInfo from './pages/PatientInfo'; 
import Doctors from './pages/Doctors';
// Import your new DoctorInfo page
import DoctorInfo from './pages/DoctorInfo'; 
import Appointments from './pages/Appointments';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dashboard */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        
        {/* Patients Routes */}
        <Route path="/patients" element={
          <ProtectedRoute>
            <Layout><Patients /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/patients/:id" element={
          <ProtectedRoute>
            <Layout><PatientInfo /></Layout>
          </ProtectedRoute>
        } />

        {/* Doctors Routes */}
        <Route path="/doctors" element={
          <ProtectedRoute>
            <Layout><Doctors /></Layout>
          </ProtectedRoute>
        } />
        
        {/* ADD THE DOCTOR INFO ROUTE HERE */}
        <Route path="/doctors/:id" element={
          <ProtectedRoute>
            <Layout><DoctorInfo /></Layout>
          </ProtectedRoute>
        } />
        
        {/* Appointments */}
        <Route path="/appointments" element={
          <ProtectedRoute>
            <Layout><Appointments /></Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;