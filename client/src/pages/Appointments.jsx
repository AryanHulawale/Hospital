import React, { useEffect, useState, useCallback } from 'react';
import {
    Plus,
    Stethoscope,
    CalendarDays,
    Trash2,
    ChevronLeft,
    ChevronRight,
    User,
    Filter,
    RefreshCcw
} from 'lucide-react';
import { fetchAppointments, deleteAppointment, fetchDoctors } from '../axios/api';
import AddAppointmentModal from '../components/AddAppointmentModal';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]); // To populate the sort list
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewDate, setViewDate] = useState(new Date());
    
    // --- NEW: Filter State ---
    const [filterDoctorId, setFilterDoctorId] = useState('all');

    const loadData = useCallback(async () => {
        try {
            const offset = selectedDate.getTimezoneOffset();
            const adjustedDate = new Date(selectedDate.getTime() - (offset * 60 * 1000));
            const dateStr = adjustedDate.toISOString().split('T')[0];
            
            // Fetch both appointments and doctors
            const [appRes, docRes] = await Promise.all([
                fetchAppointments(dateStr),
                fetchDoctors()
            ]);
            
            if (appRes && Array.isArray(appRes.data)) {
                setAppointments(appRes.data);
            }
            if (docRes && Array.isArray(docRes.data)) {
                setDoctors(docRes.data);
            }
        } catch (error) {
            console.error("Error loading data:", error);
        }
    }, [selectedDate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDelete = async (id) => {
        if (window.confirm("Cancel this appointment?")) {
            await deleteAppointment(id);
            loadData();
        }
    };

    // --- NEW: Filter Logic ---
    const displayedAppointments = appointments.filter(app => 
        filterDoctorId === 'all' || app.doctor?._id === filterDoctorId
    );

    // Calendar Helpers
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const changeMonth = (offset) => setViewDate(new Date(year, month + offset, 1));
    const isSameDay = (d1, d2) => d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

    return (
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth bg-[#f5f7f8] dark:bg-[#0f1c23]">
            <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-6">

                {/* Left Column: Schedule List */}
                <div className="flex-1 flex flex-col gap-4">
                    
                    {/* Main Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#15232d] p-5 rounded-xl shadow-soft border border-[#e2e8f0] dark:border-[#1e2e38]">
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold text-[#101618] dark:text-white">
                                {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </h2>
                            <p className="text-slate-500 text-sm font-medium">Today's Schedule</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="h-10 px-5 bg-[#0284c5] hover:bg-[#026aa0] text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg"
                        >
                            <Plus size={18} /> <span>New Appointment</span>
                        </button>
                    </div>

                    {/* --- NEW: Sub-bar with Sort/Filter Button --- */}
                    <div className="flex items-center gap-3 bg-white dark:bg-[#15232d] px-4 py-3 rounded-xl border border-[#e2e8f0] dark:border-[#1e2e38] shadow-sm">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Filter size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">Sort by Doctor:</span>
                        </div>
                        
                        <div className="relative flex-1 max-w-xs">
                            <select 
                                value={filterDoctorId}
                                onChange={(e) => setFilterDoctorId(e.target.value)}
                                className="w-full h-9 pl-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1e2e38] text-sm font-bold text-[#101618] dark:text-white outline-none focus:ring-2 focus:ring-[#0284c5]/20 transition-all appearance-none cursor-pointer"
                            >
                                <option value="all">All Doctors</option>
                                {doctors.map(doc => (
                                    <option key={doc._id} value={doc._id}>
                                        Dr. {doc.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-2.5 pointer-events-none text-slate-400">
                                <ChevronRight size={14} className="rotate-90" />
                            </div>
                        </div>

                        {filterDoctorId !== 'all' && (
                            <button 
                                onClick={() => setFilterDoctorId('all')}
                                className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors"
                            >
                                <RefreshCcw size={12} /> Reset
                            </button>
                        )}
                    </div>

                    {/* Appointments Mapping */}
                    <div className="flex flex-col gap-4 relative mt-2">
                        {displayedAppointments.length > 0 ? (
                            displayedAppointments.map((app) => (
                                <div key={app._id} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="w-16 pt-3 text-right">
                                        <span className="text-sm font-semibold text-slate-500">
                                            {new Date(app.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="flex-1 bg-white dark:bg-[#15232d] p-4 rounded-xl shadow-soft border border-[#e2e8f0] dark:border-[#1e2e38] border-l-4 border-l-[#0284c5] hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-full bg-slate-100 dark:bg-[#1e2e38] flex items-center justify-center text-[#0284c5]">
                                                    <User size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-[#101618] dark:text-white font-bold text-base">{app.patient?.fullname || app.patient?.name || 'Unknown Patient'}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
                                                        <Stethoscope size={16} />
                                                        <span>{app.reason || 'General Consultation'} • <b>Dr. {app.doctor?.fullname || app.doctor?.name}</b></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between md:justify-end gap-4">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                                    <span className="size-1.5 rounded-full bg-green-500"></span> Confirmed
                                                </span>
                                                <button onClick={() => handleDelete(app._id)} className="size-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white dark:bg-[#15232d] rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                                <p className="text-slate-500">No appointments found for the selected filter.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Mini Calendar */}
                <div className="w-full xl:w-96 flex flex-col gap-6">
                    <div className="bg-white dark:bg-[#15232d] p-5 rounded-xl shadow-soft border border-[#e2e8f0] dark:border-[#1e2e38]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-bold text-[#101618] dark:text-white">{viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                            <div className="flex gap-1 text-slate-400">
                                <button onClick={() => changeMonth(-1)} className="p-1 hover:text-[#0284c5]"><ChevronLeft size={20} /></button>
                                <button onClick={() => changeMonth(1)} className="p-1 hover:text-[#0284c5]"><ChevronRight size={20} /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 text-center mb-2 text-xs font-bold text-slate-400 uppercase">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <span key={day} className="py-1">{day}</span>)}
                        </div>
                        <div className="grid grid-cols-7 text-center gap-y-1">
                            {[...Array(firstDay)].map((_, i) => <span key={`empty-${i}`} />)}
                            {[...Array(daysInMonth)].map((_, i) => {
                                const dayNum = i + 1;
                                const currentLoopDate = new Date(year, month, dayNum);
                                const isSelected = isSameDay(currentLoopDate, selectedDate);
                                const isToday = isSameDay(currentLoopDate, new Date());
                                return (
                                    <span
                                        key={dayNum}
                                        onClick={() => setSelectedDate(currentLoopDate)}
                                        className={`text-sm py-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-[#0284c5] text-white font-bold' : isToday ? 'bg-blue-50 dark:bg-blue-900/20 text-[#0284c5] font-bold underline' : 'text-[#101618] dark:text-white hover:bg-slate-100 dark:hover:bg-[#1e2e38]'}`}
                                    >
                                        {dayNum}
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#15232d] p-5 rounded-xl shadow-soft border border-[#e2e8f0] dark:border-[#1e2e38] flex flex-col gap-4">
                        <h3 className="text-base font-bold text-[#101618] dark:text-white">Daily Overview</h3>
                        <OverviewItem
                            icon={<CalendarDays size={20} />}
                            label="Today's Appointments"
                            value={`${displayedAppointments.length} Appointments`}
                            bgColor="bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                        />
                    </div>
                </div>
            </div>

            {isModalOpen && <AddAppointmentModal onClose={() => setIsModalOpen(false)} refresh={loadData} selectedDate={selectedDate} />}
        </main>
    );
};

const OverviewItem = ({ icon, label, value, bgColor }) => (
    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#1e2e38]">
        <div className="flex items-center gap-3">
            <div className={`${bgColor} p-2 rounded-lg`}>{icon}</div>
            <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
                <span className="text-sm font-bold text-[#101618] dark:text-white">{value}</span>
            </div>
        </div>
    </div>
);

export default Appointments;