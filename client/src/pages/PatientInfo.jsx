import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  User, 
  Contact, 
  FileText, 
  Info,
  ChevronRight,
  Clock
} from 'lucide-react';
import { getPatientById, deletePatient } from '../axios/api';

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const response = await getPatientById(id);
        setPatient(response.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch patient data');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPatientData();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${patient.fullName || patient.name}? This action cannot be undone.`
    );

    if (confirmDelete) {
      try {
        await deletePatient(id);
        alert('Patient record deleted successfully.');
        navigate('/patients');
      } catch (err) {
        console.error("Delete error:", err);
        alert(err.response?.data?.msg || 'Failed to delete patient. Please try again.');
      }
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center font-bold">Loading...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500 font-bold">{error}</div>;
  if (!patient) return null;

  return (
    <div className="min-h-screen bg-[#f5f7f8] font-['Manrope'] text-[#101618] antialiased">
      <main className="max-w-6xl mx-auto p-8 w-full">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-2 text-sm font-medium">
          <Link to="/patients" className="text-[#5e7d8d] hover:text-[#0284c5] transition-colors">Patients</Link>
          <ChevronRight size={14} className="text-[#5e7d8d]" />
          <span className="text-[#0284c5] font-semibold">Patient Profile</span>
        </div>

        {/* Header & Actions with Image Implementation */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-6">
            {/* Patient Image Wrapper */}
            <div className="relative">
              <img
                // Using patient image or a default avatar if none exists
                src={patient.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV8WHZcup2a8kCzvClyXl3lKza6QtDqF8nrQ&s"} 
                alt="Patient"
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-slate-100"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black tracking-tight leading-none">
                  {patient.fullName || patient.name}
                </h1>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase tracking-wider">Active</span>
              </div>
              <p className="text-[#5e7d8d] mt-2 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-slate-200 text-[#101618] rounded text-xs font-bold tracking-wider uppercase">
                  {patient.pid || `PID-${id.substring(0, 5).toUpperCase()}`}
                </span>
                <span>•</span>
                <span className="text-sm font-medium italic">General Medicine Department</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleDelete}
              className="flex items-center px-4 h-11 border border-red-100 text-red-500 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all"
            >
              <Trash2 size={18} className="mr-2" /> Delete 
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Personal Information & Contact */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Card title="Personal Information" icon={<User size={20} />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <ViewField label="Full Name" value={patient.fullName || patient.name} />
                <div className="grid grid-cols-2 gap-4">
                  <ViewField label="Age" value={`${patient.age} Years`} />
                  <ViewField label="Gender" value={patient.gender} />
                </div>
                <ViewField label="Created At" value={new Date(patient.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })} />
                <ViewField label="Last Updated" value={new Date(patient.updatedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })} />
              </div>
            </Card>

            <Card title="Contact Information" icon={<Contact size={20} />}>
              <div className="flex flex-col gap-6">
                <ViewField label="Contact Number" value={`+91 ${patient.contactNumber}`} />
                <ViewField label="Physical Address" value={patient.address} multiline />
              </div>
            </Card>
          </div>

          {/* Medical History */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card title="Medical History" icon={<FileText size={20} />} fullHeight>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs font-bold text-[#5e7d8d] uppercase tracking-wider">Clinical Notes & Observations</label>
                <div className="w-full flex-1 rounded-lg bg-[#f9fafb] border border-[#f0f3f5] p-4 text-sm font-medium text-[#101618] leading-relaxed min-h-[350px] whitespace-pre-wrap">
                  {patient.medicalHistory || "No medical history recorded for this patient."}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#f0f3f5]">
                <div className="flex items-center gap-2 text-[#5e7d8d]">
                  <Info size={14} />
                  <p className="text-[10px] font-medium italic">This is a read-only clinical record.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

/* --- Helper Components --- */
const ViewField = ({ label, value, multiline = false }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-[#5e7d8d] uppercase tracking-wider">{label}</label>
    <div className={`w-full px-4 py-3 rounded-lg bg-[#f9fafb] border border-[#f0f3f5] text-sm font-semibold text-[#101618] ${multiline ? 'min-h-[80px] whitespace-pre-wrap' : ''}`}>
      {value || '—'}
    </div>
  </div>
);

const Card = ({ title, icon, children, fullHeight }) => (
  <div className={`bg-white rounded-xl border border-[#e5e9eb] shadow-sm p-6 flex flex-col ${fullHeight ? 'h-full' : ''}`}>
    <div className="flex items-center gap-2 mb-6 border-b border-[#f0f3f5] pb-4">
      <span className="text-[#0284c5]">{icon}</span>
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
    {children}
  </div>
);

export default PatientProfile;