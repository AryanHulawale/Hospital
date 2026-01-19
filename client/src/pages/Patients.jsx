import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
    Plus,
    Search,
    Users,
    BedDouble,
    CheckCircle,
    UserPlus,
    Filter,
    Download,
    Trash2,
    Pencil,
    Eye // Added Eye icon for better UX
} from 'lucide-react';
import { fetchPatients, deletePatient } from '../axios/api';
import AddPatientModal from '../components/AddPatientModal';
import UpdatePatientModel from '../components/updatePatientModel';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModelOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const navigate = useNavigate(); // Initialize navigate

    const loadPatients = async () => {
        try {
            const { data } = await fetchPatients();
            setPatients(data);
        } catch (err) {
            console.error("Failed to load patients", err);
        }
    };

    useEffect(() => { loadPatients(); }, []);

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Prevent row click navigation
        if (window.confirm("Delete this patient record?")) {
            await deletePatient(id);
            loadPatients();
        }
    };

    const handleEdit = (e, patient) => {
        e.stopPropagation(); // Prevent row click navigation
        try {
            setSelectedPatient(patient);
            setIsEditModelOpen(true);
        } catch (err) {
            console.error("Edit failed", err);
        }
    };

    // Navigation function
    const handleRowClick = (id) => {
        navigate(`/patients/${id}`); // Adjust this route to match your App.js route for PatientProfile
    };

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'PT';
    };

    return (
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth bg-[#f1f5f9] dark:bg-[#0f1c23]">
            <div className="max-w-[1400px] mx-auto flex flex-col gap-6">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-extrabold text-[#101618] dark:text-white tracking-tight">Patients Management</h2>
                        <p className="text-sm text-slate-500 mt-1">Manage patient records, admissions, and history.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-[#0284c5] hover:bg-[#026aa0] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[#0284c5]/20 transition-all"
                    >
                        <Plus size={18} />
                        Register Patient
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard label="Total Patients" value={patients.length} icon={<Users size={20} />} color="blue" />
                    <StatCard label="Admitted" value="142" icon={<BedDouble size={20} />} color="amber" />
                    <StatCard label="Discharged" value="68" icon={<CheckCircle size={20} />} color="green" />
                    <StatCard label="New (Today)" value="12" icon={<UserPlus size={20} />} color="purple" />
                </div>

                {/* Search Bar */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#dae2e7] dark:border-gray-700 dark:bg-[#1a2630] dark:text-white text-sm focus:ring-2 focus:ring-[#0284c5]/20 outline-none"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* <button className="h-10 px-4 rounded-xl bg-white dark:bg-[#1a2630] border border-[#dae2e7] dark:border-gray-700 text-slate-500 hover:text-[#0284c5] transition-colors flex items-center gap-2 text-sm font-medium ml-auto">
                        <Download size={18} /> Export
                    </button> */}
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-[#1a2630] rounded-xl border border-[#dae2e7] dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-gray-800/50 border-b border-[#dae2e7] dark:border-gray-700">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Age / Sex</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Medical History</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#dae2e7] dark:divide-gray-700">
                                {patients.length > 0 ? (
                                    patients
                                        .filter(p => (p.fullname || p.name)?.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((p) => (
                                            <tr
                                                key={p._id}
                                                onClick={() => handleRowClick(p._id)} // Handle Row Click
                                                className="group hover:bg-[#0284c5]/5 transition-colors cursor-pointer"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-9 rounded-full bg-[#0284c5]/10 text-[#0284c5] flex items-center justify-center font-bold text-xs group-hover:bg-[#0284c5] group-hover:text-white transition-all">
                                                            {getInitials(p.fullname || p.name)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-[#101618] dark:text-white">{p.fullname || p.name}</p>
                                                            <p className="text-xs text-slate-400 uppercase">#PID-{p._id.slice(-6)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {p.age} / {p.gender?.[0] || 'U'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    {p.contactNumber || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500 max-w-[200px] truncate">
                                                    {p.medicalHistory || 'No history recorded'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                                                        Active
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-1">
                                                        {/* View Profile Button */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevent duplicate navigation from row click
                                                                handleRowClick(p._id);
                                                            }}
                                                            className="p-2 rounded-lg text-slate-400 hover:text-[#0284c5] hover:bg-blue-50 transition-colors"
                                                            title="View Profile"
                                                        >
                                                            <Eye size={16} />
                                                        </button>

                                                        {/* Edit Button */}
                                                        <button
                                                            onClick={(e) => handleEdit(e, p)}
                                                            className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>

                                                        {/* Delete Button */}
                                                        <button
                                                            onClick={(e) => handleDelete(e, p._id)}
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
                                        <td colSpan="6" className="px-6 py-10 text-center text-slate-400 italic">No patients found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isModalOpen && <AddPatientModal onClose={() => setIsModalOpen(false)} refresh={loadPatients} />}
            {isEditModalOpen && <UpdatePatientModel onClose={() => setIsEditModelOpen(false)} refresh={loadPatients} patient={selectedPatient} />}
        </main>
    );
};

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

export default Patients;