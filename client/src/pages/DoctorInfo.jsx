import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Trash2,
    User,
    Mail,
    Stethoscope,
    ChevronRight,
    Clock,
    Info
} from 'lucide-react';
import { deleteDoctor, getDoctorById } from '../axios/api';

const DoctorProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                setLoading(true);
                const response = await getDoctorById(id);
                setDoctor(response.data);
            } catch (err) {
                setError(err.response?.data?.msg || 'Failed to fetch doctor data');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchDoctorData();
    }, [id]);

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to remove this doctor?")) {
            try {
                await deleteDoctor(doctor._id);
                navigate('/doctors');
            } catch (err) {
                console.error("Delete failed", err);
                alert("Failed to delete doctor");
            }
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center font-bold">Loading...</div>;
    if (error) return <div className="flex h-screen items-center justify-center text-red-500 font-bold">{error}</div>;
    if (!doctor) return null;

    return (
        <div className="min-h-screen bg-[#f5f7f8] font-['Manrope'] text-[#101618] antialiased">
            <main className="max-w-6xl mx-auto p-8 w-full">

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                    <Link to="/doctors" className="text-[#5e7d8d] hover:text-[#0284c5] transition-colors">Doctors</Link>
                    <ChevronRight size={14} className="text-[#5e7d8d]" />
                    <span className="text-[#0284c5] font-semibold">Doctor Profile</span>
                </div>

                {/* Header & Actions */}
                <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <img
                                src={doctor.image || "https://static.vecteezy.com/system/resources/thumbnails/053/393/142/small/doctor-wearing-a-mask-lab-coat-and-stethoscope-simple-illustration-free-photo.jpg"}
                                alt="Doctor"
                                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md"
                            />
                            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight leading-none">{doctor.name}</h1>
                            <p className="text-[#5e7d8d] mt-2 flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-slate-200 text-[#101618] rounded text-xs font-bold tracking-wider uppercase">
                                    {doctor._id ? `DOC-${doctor._id.substring(0, 5).toUpperCase()}` : 'DOC-ID'}
                                </span>
                                <span>•</span>
                                <span className="text-sm font-medium italic">{doctor.specialization || 'Medical Specialist'}</span>
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
                    {/* Left Column - 8 Cols */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <Card title="Personal Information" icon={<User size={20} />}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <ViewField label="Full Name" value={doctor.name} />
                                <ViewField label="Doctor ID" value={doctor._id} />
                                <ViewField
                                    label="Joined Date"
                                    value={new Date(doctor.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
                                />
                                <ViewField
                                    label="Account Status"
                                    value="Active"
                                />
                            </div>
                        </Card>

                        <Card title="Contact Information" icon={<Mail size={20} />}>
                            <div className="flex flex-col gap-6">
                                <ViewField label="Email Address" value={doctor.email} />
                                <ViewField label="Contact Number" value={doctor.contactNumber} prefix="+91" />
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - 4 Cols */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <Card title="Medical Specialization" icon={<Stethoscope size={20} />} fullHeight>
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="text-xs font-bold text-[#5e7d8d] uppercase tracking-wider">Expertise & Certifications</label>
                                <div className="w-full flex-1 rounded-lg bg-[#f9fafb] border border-[#f0f3f5] p-4 flex flex-wrap gap-2 content-start min-h-[350px]">
                                    {doctor.specialization ? (
                                        <span className="px-4 py-2 bg-[#f0f9ff] text-[#0284c5] rounded-lg text-sm font-bold border border-[#e0f2fe] h-fit">
                                            {doctor.specialization}
                                        </span>
                                    ) : (
                                        <p className="text-sm font-medium text-[#5e7d8d] italic">No specialization data recorded.</p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-[#f0f3f5]">
                                <div className="flex items-center gap-2 text-[#5e7d8d]">
                                    <Info size={14} />
                                    <p className="text-[10px] font-medium italic">Verified Medical Professional Record</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Reusable View-Only Field Component
const ViewField = ({ label, value, prefix }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#5e7d8d] uppercase tracking-wider">{label}</label>
        <div className="w-full px-4 py-3 rounded-lg bg-[#f9fafb] border border-[#f0f3f5] text-sm font-semibold text-[#101618]">
            {prefix && <span className="mr-1">{prefix}</span>}
            {value || '—'}
        </div>
    </div>
);

// Reusable Card Component
const Card = ({ title, icon, children, fullHeight }) => (
    <div className={`bg-white rounded-xl border border-[#e5e9eb] shadow-sm p-6 flex flex-col ${fullHeight ? 'h-full' : ''}`}>
        <div className="flex items-center gap-2 mb-6 border-b border-[#f0f3f5] pb-4">
            <span className="text-[#0284c5]">{icon}</span>
            <h3 className="text-lg font-bold">{title}</h3>
        </div>
        {children}
    </div>
);

export default DoctorProfile;