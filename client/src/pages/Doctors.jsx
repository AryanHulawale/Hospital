import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Users,
    Stethoscope,
    Activity,
    Clock,
    Download,
    Trash2,
    Pencil,
    Eye,
    Mail,
    Phone
} from 'lucide-react';
import { fetchDoctors, deleteDoctor } from '../axios/api';
import AddDoctorModal from '../components/AddDoctorModal';
import UpdateDoctor from '../components/updateDoctorModel';

const Doctors = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const loadDoctors = async () => {
        try {
            const { data } = await fetchDoctors();
            setDoctors(data);
        } catch (err) {
            console.error("Error fetching doctors", err);
        }
    };

    useEffect(() => {
        loadDoctors();
    }, []);

    const handleViewProfile = (id) => {
        navigate(`/doctors/${id}`);
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to remove this doctor?")) {
            try {
                await deleteDoctor(id);
                loadDoctors();
            } catch (err) {
                console.error("Delete failed", err);
            }
        }
    };

    const handleEdit = (e, doctor) => {
        e.stopPropagation();
        setSelectedDoctor(doctor);
        setIsEditModalOpen(true);
    };

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'DR';
    };

    const filteredDoctors = doctors.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth bg-[#f1f5f9] dark:bg-[#0f1c23]">
            <div className="max-w-[1400px] mx-auto flex flex-col gap-6">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-extrabold text-[#101618] dark:text-white tracking-tight">Doctors Management</h2>
                        <p className="text-sm text-slate-500 mt-1">Manage doctor profiles, specialties, and duty status.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-[#0284c5] hover:bg-[#026aa0] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[#0284c5]/20 transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        Register Doctor
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard label="Total Doctors" value={doctors.length} icon={<Users size={20} />} color="blue" />
                    <StatCard label="On Duty" value="18" icon={<Activity size={20} />} color="green" />
                    <StatCard label="Specialists" value="12" icon={<Stethoscope size={20} />} color="purple" />
                    <StatCard label="Available" value="8" icon={<Clock size={20} />} color="amber" />
                </div>

                {/* Search & Export Bar */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or specialty..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#dae2e7] dark:border-gray-700 dark:bg-[#1a2630] dark:text-white text-sm focus:ring-2 focus:ring-[#0284c5]/20 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* <button className="h-10 px-4 rounded-xl bg-white dark:bg-[#1a2630] border border-[#dae2e7] dark:border-gray-700 text-slate-500 hover:text-[#0284c5] transition-colors flex items-center gap-2 text-sm font-medium ml-auto">
                        <Download size={18} /> Export
                    </button> */}
                </div>

                {/* Table Container */}
                <div className="bg-white dark:bg-[#1a2630] rounded-xl border border-[#dae2e7] dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-gray-800/50 border-b border-[#dae2e7] dark:border-gray-700">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Doctor Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Specialty</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Info</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#dae2e7] dark:divide-gray-700">
                                {filteredDoctors.length > 0 ? (
                                    filteredDoctors.map((doc) => (
                                        <tr 
                                            key={doc._id} 
                                            onClick={() => handleViewProfile(doc._id)}
                                            className="group hover:bg-[#0284c5]/5 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-9 rounded-full bg-[#0284c5]/10 text-[#0284c5] flex items-center justify-center font-bold text-xs group-hover:bg-[#0284c5] group-hover:text-white transition-all">
                                                        {getInitials(doc.name)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-[#101618] dark:text-white">Dr. {doc.name}</p>
                                                        <p className="text-xs text-slate-400 uppercase">#DOC-{doc._id.slice(-6)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-[#0284c5] border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
                                                    {doc.specialization}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                        <Mail size={12} /> {doc.email}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                        <Phone size={12} /> {doc.contactNumber}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleViewProfile(doc._id); }}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-[#0284c5] hover:bg-blue-50 transition-colors"
                                                        title="View"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleEdit(e, doc)}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => handleDelete(e, doc._id)}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-slate-400 italic">No doctors found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isModalOpen && <AddDoctorModal onClose={() => setIsModalOpen(false)} refresh={loadDoctors} />}
            {isEditModalOpen && <UpdateDoctor onClose={() => setIsEditModalOpen(false)} refresh={loadDoctors} doctor={selectedDoctor} />}
        </main>
    );
};

// Reusable StatCard component within the same file or imported
const StatCard = ({ label, value, icon, color }) => {
    const colors = {
        blue: "bg-blue-50 text-[#0284c5]",
        amber: "bg-amber-50 text-amber-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600",
    };
    return (
        <div className="bg-white dark:bg-[#1a2630] p-4 rounded-xl border border-[#dae2e7] dark:border-gray-800 shadow-sm flex items-center justify-between transition-all hover:border-[#0284c5]/50">
            <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-bold text-[#101618] dark:text-white mt-1">{value}</p>
            </div>
            <div className={`size-10 rounded-full flex items-center justify-center ${colors[color]}`}>
                {icon}
            </div>
        </div>
    );
};

export default Doctors;