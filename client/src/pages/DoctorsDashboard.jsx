import React, { useEffect, useState, useCallback } from 'react';
import { CheckCircle2, Clock, User, Stethoscope, CalendarDays } from 'lucide-react';
import { fetchAppointments, fetchMe, updateAppointmentStatus } from '../axios/api';

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async (isInitial = false) => {
        try {
            if (isInitial) setLoading(true);
            const userRes = await fetchMe();
            const currentUser = userRes.data;
            setDoctorInfo(currentUser);

            const todayStr = new Date().toISOString().split('T')[0];

            // 1. Fetch today's appointments for this doctor
            const appRes = await fetchAppointments(todayStr, currentUser._id);

            if (appRes && Array.isArray(appRes.data)) {
                // 2. Filter to ensure the doctor only sees their own assigned slots
                const myAppts = appRes.data.filter(app => {
                    const appDoctorId = app.doctor?._id || app.doctor;
                    const currentUserId = currentUser._id;
                    return appDoctorId?.toString() === currentUserId?.toString();
                });

                setAppointments(myAppts);
            }
        } catch (error) {
            console.error("Dashboard Load Error:", error);
        } finally {
            if (isInitial) setLoading(false);
        }
    }, []);

    // Initial load and background polling every 5 seconds for "Direct" updates
    useEffect(() => {
        loadData(true);
        const interval = setInterval(() => {
            loadData(false); // Background refresh without showing the loader
        }, 5000);

        return () => clearInterval(interval);
    }, [loadData]);

    const handleStatusToggle = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
        try {
            await updateAppointmentStatus(id, newStatus);

            // Instant UI update for the doctor
            setAppointments(prev => prev.map(app =>
                app._id === id ? { ...app, status: newStatus } : app
            ));
        } catch (err) {
            console.error("Status toggle error:", err);
            alert("Failed to update status. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#f5f7f8]">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0284c5] border-t-transparent"></div>
                <p className="font-bold text-slate-600">Loading your schedule...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen flex-1 bg-[#f5f7f8] p-4 font-['Manrope'] text-[#101618] md:p-8">
            <div className="mx-auto max-w-5xl space-y-6">

                {/* Header Section */}
                <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
                    <div>
                        <h2 className="text-2xl font-bold">
                            Welcome, Dr. {doctorInfo?.username || doctorInfo?.fullname || 'Doctor'}
                        </h2>
                        <p className="text-sm font-medium text-slate-500">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-[#0284c5]">
                        <CalendarDays size={20} />
                        <span className="text-sm font-bold">{appointments.length} Appointments Today</span>
                    </div>
                </div>

                {/* Appointment Timeline */}
                <div className="flex flex-col gap-4">
                    {appointments.length > 0 ? (
                        appointments.map((app) => (
                            <div key={app._id} className="group flex gap-4">
                                {/* Time Column */}
                                <div className="w-20 shrink-0 pt-4 text-right">
                                    <span className="text-sm font-bold text-slate-400">
                                        {new Date(app.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                {/* Patient Card */}
                                <div className={`flex-1 rounded-xl border border-slate-200 border-l-4 bg-white p-5 shadow-sm transition-all hover:shadow-md ${app.status === 'Completed' ? 'border-l-emerald-500 bg-slate-50/50' : 'border-l-[#0284c5]'}`}>
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 font-bold text-[#0284c5]">
                                                {/* FIXED PATIENT NAME ACCESS */}
                                                {(app.patient?.fullname || app.patient?.name || "P").charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className={`text-lg font-bold ${app.status === 'Completed' ? 'text-slate-400 line-through' : ''}`}>
                                                    {/* FIXED PATIENT NAME ACCESS */}
                                                    {app.patient?.fullname || app.patient?.name || 'Patient'}
                                                </h3>
                                                <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                                                    <Stethoscope size={16} />
                                                    <span>Reason: {app.reason || 'General Consultation'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${app.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                                                <span className={`size-1.5 rounded-full ${app.status === 'Completed' ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
                                                {app.status || 'Pending'}
                                            </span>

                                            <button
                                                onClick={() => handleStatusToggle(app._id, app.status || 'Pending')}
                                                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${app.status === 'Completed' ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' : 'bg-[#0284c5] text-white shadow-lg shadow-blue-500/20 hover:bg-[#026aa0]'}`}
                                            >
                                                {app.status === 'Completed' ? <Clock size={16} /> : <CheckCircle2 size={16} />}
                                                {app.status === 'Completed' ? 'Undo' : 'Complete'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-20">
                            <CalendarDays size={48} className="mb-4 text-slate-300" />
                            <p className="font-bold text-slate-500">No appointments assigned to you today.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default DoctorDashboard;